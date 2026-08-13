import { NextRequest, NextResponse } from 'next/server';
import { authorizeAdmin, isAuthorizedAdmin } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  const auth = await authorizeAdmin(request);
  if (!isAuthorizedAdmin(auth)) return auth;

  const url = new URL(request.url);
  const q = url.searchParams;
  const page = Math.max(1, parseInt(q.get('page') || '1'));
  const pageSize = Math.min(100, Math.max(1, parseInt(q.get('pageSize') || '20')));
  const status = q.get('status');
  const service = q.get('service');
  const phone = q.get('phone');
  const date = q.get('date');

  try {
    let query = auth.supabase.from('appointments').select('*', { count: 'exact' }).order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    if (service) query = query.ilike('service_name', `%${service}%`);
    if (phone) query = query.eq('phone_number', phone);
    if (date) query = query.eq('appointment_date', date);

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await query.range(from, to);
    if (error) throw error;

    return NextResponse.json({ data, count, page, pageSize });
  } catch (err: any) {
    console.error('admin/appointments error', err);
    return NextResponse.json({ error: 'Unable to load appointment records' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await authorizeAdmin(request);
  if (!isAuthorizedAdmin(auth)) return auth;

  const supabase = auth.supabase;
  try {
    const body = await request.json();
    const { customer_name, phone_number, service_name, appointment_date, appointment_time, notes } = body;

    if (!customer_name || !phone_number || !service_name || !appointment_date || !appointment_time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const dateObj = new Date(appointment_date);
    if (isNaN(dateObj.getTime())) return NextResponse.json({ error: 'Invalid appointment_date' }, { status: 400 });

    const staff_id = body.staff_id ?? null;
    const duration_minutes = body.duration_minutes ?? 60;
    const start_ts = body.start_ts ?? null;

    if (staff_id && start_ts) {
      const { data: conflict, error: conflictError } = await supabase.rpc('has_conflict', { p_staff: staff_id, p_start: start_ts, p_duration: duration_minutes });
      if (conflictError) throw conflictError;
      if (conflict === true) return NextResponse.json({ error: 'Slot already booked for staff' }, { status: 409 });
    } else {
      const { data: existing, error: existingError } = await supabase
        .from('appointments')
        .select('id,status')
        .eq('appointment_date', appointment_date)
        .eq('appointment_time', appointment_time)
        .not('status', 'eq', 'cancelled')
        .limit(1)
        .maybeSingle();
      if (existingError) throw existingError;
      if (existing) return NextResponse.json({ error: 'Slot already booked' }, { status: 409 });
    }

    const payload: any = {
      customer_name,
      phone_number,
      service_name,
      appointment_date,
      appointment_time,
      notes: notes ?? '',
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (staff_id) payload.staff_id = staff_id;
    if (duration_minutes) payload.duration_minutes = duration_minutes;
    if (start_ts) payload.start_ts = start_ts;

    const { data: inserted, error: insertError } = await supabase.from('appointments').insert(payload).select().maybeSingle();
    if (insertError) throw insertError;

    await supabase.from('audit_logs').insert({ actor_user_id: auth.user.id, action: 'create_appointment', entity: 'appointments', entity_id: inserted?.id, metadata: { service_name } });

    return NextResponse.json({ appointment: inserted }, { status: 201 });
  } catch (err: any) {
    console.error('admin/appointments POST error', err);
    return NextResponse.json({ error: 'Unable to create the appointment' }, { status: 500 });
  }
}

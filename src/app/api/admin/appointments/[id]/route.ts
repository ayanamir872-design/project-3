import { NextRequest, NextResponse } from 'next/server';
import { authorizeAdmin, isAuthorizedAdmin } from '@/lib/adminAuth';

export async function PUT(request: NextRequest, context: any) {
  const auth = await authorizeAdmin(request);
  if (!isAuthorizedAdmin(auth)) return auth;

  const supabase = auth.supabase;
  try {
    const params = (context && context.params) || {};
    const id = params.id;

    const body = await request.json();
    const { status, appointment_date, appointment_time, service_name, customer_name, phone_number, notes, staff_id, start_ts, duration_minutes } = body;

    if (staff_id && start_ts) {
      const { data: conflict, error: conflictError } = await supabase.rpc('has_conflict', { p_staff: staff_id, p_start: start_ts, p_duration: duration_minutes ?? 60, p_exclude: id });
      if (conflictError) throw conflictError;
      if (conflict === true) return NextResponse.json({ error: 'Slot already booked for staff' }, { status: 409 });
    } else if ((appointment_date && appointment_time) && (appointment_date !== undefined && appointment_time !== undefined)) {
      const { data: existing, error: existingError } = await supabase
        .from('appointments')
        .select('id')
        .eq('appointment_date', appointment_date)
        .eq('appointment_time', appointment_time)
        .not('status', 'eq', 'cancelled')
        .neq('id', id)
        .limit(1)
        .maybeSingle();
      if (existingError) throw existingError;
      if (existing) return NextResponse.json({ error: 'Slot already booked' }, { status: 409 });
    }

    const updates: any = { updated_at: new Date().toISOString() };
    if (status) updates.status = status;
    if (appointment_date) updates.appointment_date = appointment_date;
    if (appointment_time) updates.appointment_time = appointment_time;
    if (service_name) updates.service_name = service_name;
    if (customer_name) updates.customer_name = customer_name;
    if (phone_number) updates.phone_number = phone_number;
    if (notes !== undefined) updates.notes = notes;
    if (staff_id !== undefined) updates.staff_id = staff_id;
    if (start_ts !== undefined) updates.start_ts = start_ts;
    if (duration_minutes !== undefined) updates.duration_minutes = duration_minutes;

    const { data: updated, error } = await supabase.from('appointments').update(updates).eq('id', id).select().maybeSingle();
    if (error) throw error;

    await supabase.from('audit_logs').insert({ actor_user_id: auth.user.id, action: 'update_appointment', entity: 'appointments', entity_id: id, metadata: { status } });

    return NextResponse.json({ appointment: updated });
  } catch (err: any) {
    console.error('admin/appointments [id] PUT error', err);
    return NextResponse.json({ error: 'Unable to update the appointment' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { authorizeAdmin, isAuthorizedAdmin } from '@/lib/adminAuth';

const APPOINTMENT_STATUSES = ['pending', 'confirmed', 'cancelled'] as const;

type RouteContext = {
  params: Promise<{ id: string }>;
};

function getErrorDetails(error: unknown) {
  if (error instanceof Error) return error.message;
  if (!error || typeof error !== 'object') return 'Unknown server error';

  const supabaseError = error as {
    code?: string;
    details?: string;
    hint?: string;
    message?: string;
  };

  return [
    supabaseError.message,
    supabaseError.details,
    supabaseError.hint,
    supabaseError.code ? `code: ${supabaseError.code}` : undefined,
  ].filter(Boolean).join(' | ') || 'Unknown server error';
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const auth = await authorizeAdmin(request);
  if (!isAuthorizedAdmin(auth)) return auth;

  const supabase = auth.supabase;
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Appointment id is required' }, { status: 400 });
    }

    const body = await request.json();
    const { status, appointment_date, appointment_time, service_name, customer_name, phone_number, notes, staff_id, start_ts, duration_minutes } = body;

    if (status !== undefined && (typeof status !== 'string' || !APPOINTMENT_STATUSES.includes(status as typeof APPOINTMENT_STATUSES[number]))) {
      return NextResponse.json({ error: 'Invalid appointment status' }, { status: 400 });
    }

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
    if (!updated) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    await supabase.from('audit_logs').insert({ actor_user_id: auth.user.id, action: 'update_appointment', entity: 'appointments', entity_id: id, metadata: { status } });

    return NextResponse.json({ appointment: updated });
  } catch (err: any) {
    console.error('admin/appointments [id] PUT error', err);
    return NextResponse.json({ error: 'Unable to update appointment', details: getErrorDetails(err) }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const auth = await authorizeAdmin(_request);
  if (!isAuthorizedAdmin(auth)) return auth;

  try {
    const { id } = await params;
    if (!id || !isUuid(id)) {
      return NextResponse.json({ error: 'Valid appointment id is required' }, { status: 400 });
    }

    const { data: deleted, error } = await auth.supabase
      .from('appointments')
      .delete()
      .eq('id', id)
      .select('id')
      .maybeSingle();

    if (error) throw error;
    if (!deleted) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    const { error: auditError } = await auth.supabase.from('audit_logs').insert({
      actor_user_id: auth.user.id,
      action: 'delete_appointment',
      entity: 'appointments',
      entity_id: id,
      metadata: {},
    });
    if (auditError) console.warn('Appointment deleted; audit log was not recorded', auditError.message);

    return NextResponse.json({ deleted: true, id });
  } catch (err: unknown) {
    console.error('admin/appointments [id] DELETE error', err);
    return NextResponse.json({ error: 'Unable to delete appointment', details: getErrorDetails(err) }, { status: 500 });
  }
}

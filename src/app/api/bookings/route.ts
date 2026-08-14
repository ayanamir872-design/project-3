import { NextRequest, NextResponse } from 'next/server';
import { getPublicSupabaseConfigError, getPublicSupabaseServerClient } from '../../../lib/supabasePublicServerClient';
import { slugifyServiceName } from '@/lib/serviceValidation';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function resolveActiveService(supabase: ReturnType<typeof getPublicSupabaseServerClient>, serviceId: string | null, serviceName: string) {
  if (!supabase) return { service: null, error: 'Server database is not configured.' };

  if (serviceId) {
    if (!UUID_PATTERN.test(serviceId)) return { service: null, error: 'Invalid service.' };
    const { data, error } = await supabase
      .from('services')
      .select('id,name,slug,price,currency,duration_minutes,is_active')
      .eq('id', serviceId)
      .maybeSingle();
    if (error) return { service: null, error: 'Unable to validate the selected service.' };
    if (!data) return { service: null, error: 'Selected service was not found.' };
    if (!data.is_active) return { service: null, error: 'Selected service is no longer available.' };
    return { service: data, error: null };
  }

  const slug = slugifyServiceName(serviceName);
  const { data, error } = await supabase
    .from('services')
    .select('id,name,slug,price,currency,duration_minutes,is_active')
    .eq('slug', slug)
    .maybeSingle();
  if (error) return { service: null, error: 'Unable to validate the selected service.' };
  if (!data) return { service: null, error: 'A valid service is required.' };
  if (!data.is_active) return { service: null, error: 'Selected service is no longer available.' };
  return { service: data, error: null };
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getPublicSupabaseServerClient();
    if (!supabase) return NextResponse.json({ error: getPublicSupabaseConfigError() ?? 'Server database is not configured' }, { status: 503 });

    const body = await request.json();
    const customerName = typeof body.customer_name === 'string' ? body.customer_name.trim() : '';
    const phoneNumber = typeof body.phone_number === 'string' ? body.phone_number.trim() : '';
    const serviceName = typeof body.service_name === 'string' ? body.service_name.trim() : '';
    const serviceId = typeof body.service_id === 'string' && body.service_id.trim() ? body.service_id.trim() : null;
    const appointmentDate = typeof body.appointment_date === 'string' ? body.appointment_date.trim() : '';
    const appointmentTime = typeof body.appointment_time === 'string' ? body.appointment_time.trim() : '';

    if (!customerName || !phoneNumber || (!serviceName && !serviceId) || !appointmentDate || !appointmentTime) {
      return NextResponse.json({ error: 'Missing required booking fields' }, { status: 400 });
    }
    if (customerName.length < 2 || customerName.length > 120) return NextResponse.json({ error: 'Invalid customer name.' }, { status: 400 });
    if (phoneNumber.length < 7 || phoneNumber.length > 30) return NextResponse.json({ error: 'Invalid phone number.' }, { status: 400 });
    if (appointmentTime.length < 3 || appointmentTime.length > 20) return NextResponse.json({ error: 'Invalid appointment time.' }, { status: 400 });
    if (typeof body.notes === 'string' && body.notes.length > 1000) return NextResponse.json({ error: 'Booking notes are too long.' }, { status: 400 });

    const parsedDate = new Date(`${appointmentDate}T00:00:00`);
    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: 'Invalid appointment date' }, { status: 400 });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (parsedDate < today) return NextResponse.json({ error: 'Appointment date must be today or later.' }, { status: 400 });

    const serviceResult = await resolveActiveService(supabase, serviceId, serviceName);
    if (serviceResult.error || !serviceResult.service) {
      return NextResponse.json({ error: serviceResult.error ?? 'Invalid service.' }, { status: 400 });
    }

    const service = serviceResult.service;

    const payload = {
      customer_name: customerName,
      phone_number: phoneNumber,
      service_id: service.id,
      service_name: service.name,
      service_price_at_booking: service.price,
      service_currency_at_booking: service.currency,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      notes: body.notes ?? '',
      status: 'pending',
    };

    const { error } = await supabase.from('appointments').insert(payload);

    if (error) {
      if (error.code === '23505') return NextResponse.json({ error: 'Slot already booked' }, { status: 409 });
      throw error;
    }

    return NextResponse.json({ appointment: { status: 'pending' } }, { status: 201 });
  } catch (error) {
    console.error('Failed to create appointment', error);
    return NextResponse.json(
      {
        error: 'Could not save appointment',
        ...(process.env.NODE_ENV === 'development' && {
          details: error instanceof Error ? error.message : String(error),
        }),
      },
      { status: 500 },
    );
  }
}

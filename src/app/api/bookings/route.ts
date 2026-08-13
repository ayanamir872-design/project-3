import { NextRequest, NextResponse } from 'next/server';
import { getPublicSupabaseConfigError, getPublicSupabaseServerClient } from '../../../lib/supabasePublicServerClient';

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getPublicSupabaseServerClient();
    if (!supabase) return NextResponse.json({ error: getPublicSupabaseConfigError() ?? 'Server database is not configured' }, { status: 503 });

    const body = await request.json();
    const { customer_name, phone_number, service_name, appointment_date, appointment_time } = body;

    if (!customer_name || !phone_number || !service_name || !appointment_date || !appointment_time) {
      return NextResponse.json({ error: 'Missing required booking fields' }, { status: 400 });
    }

    const parsedDate = new Date(`${appointment_date}T00:00:00`);
    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: 'Invalid appointment date' }, { status: 400 });
    }

    const payload = {
      customer_name,
      phone_number,
      service_name,
      appointment_date,
      appointment_time,
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
    return NextResponse.json({ error: 'Could not save appointment' }, { status: 500 });
  }
}

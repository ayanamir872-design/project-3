import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

function getSupabaseClient(options: { write?: boolean } = {}) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const write = options.write ?? false;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  if (write && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('Using anonymous Supabase key for write operations because SUPABASE_SERVICE_ROLE_KEY is not set. Make sure row-level security allows insert access.');
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function GET() {
  try {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const { data, error } = await supabase.from('appointments').select('*').order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ appointments: data ?? [] });
  } catch (error) {
    console.error('Failed to fetch appointments', error);
    return NextResponse.json({
      error: 'Could not fetch appointments',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient({ write: true });

    if (!supabase) {
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const body = await request.json();

    const payload = {
      customer_name: body.customer_name,
      phone_number: body.phone_number,
      service_name: body.service_name,
      appointment_date: body.appointment_date,
      appointment_time: body.appointment_time,
      notes: body.notes ?? '',
      status: body.status ?? 'pending',
    };

    const { data, error } = await supabase.from('appointments').insert(payload).select().single();

    if (error) throw error;

    return NextResponse.json({ appointment: data }, { status: 201 });
  } catch (error) {
    console.error('Failed to create appointment', error);
    return NextResponse.json({
      error: 'Could not save appointment',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}

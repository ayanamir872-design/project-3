import { NextRequest, NextResponse } from 'next/server';
import { authorizeAdmin, isAuthorizedAdmin } from '@/lib/adminAuth';

const DASHBOARD_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'] as const;

export async function GET(request: NextRequest) {
  const auth = await authorizeAdmin(request);
  if (!isAuthorizedAdmin(auth)) return auth;

  const supabase = auth.supabase;
  const today = new Date().toISOString().slice(0, 10);

  try {
    const [total, todayCount, ...statusResults] = await Promise.all([
      supabase.from('appointments').select('id', { count: 'exact', head: true }),
      supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('appointment_date', today),
      ...DASHBOARD_STATUSES.map((status) =>
        supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('status', status),
      ),
    ]);

    const failed = [total, todayCount, ...statusResults].find((result) => result.error);
    if (failed?.error) throw failed.error;

    const recentResult = await supabase
      .from('appointments')
      .select('id,customer_name,service_name,appointment_date,appointment_time,status,created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    if (recentResult.error) throw recentResult.error;

    const upcomingResult = await supabase
      .from('appointments')
      .select('id,customer_name,service_name,appointment_date,appointment_time,status')
      .gte('appointment_date', today)
      .neq('status', 'cancelled')
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true })
      .limit(5);
    if (upcomingResult.error) throw upcomingResult.error;

    const statusCounts = Object.fromEntries(
      DASHBOARD_STATUSES.map((status, index) => [status, statusResults[index].count ?? 0]),
    );

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      metrics: {
        totalAppointments: total.count ?? 0,
        todayAppointments: todayCount.count ?? 0,
        statusCounts,
        activeServices: null,
        totalCustomers: null,
        revenue: null,
      },
      recentAppointments: recentResult.data ?? [],
      upcomingAppointments: upcomingResult.data ?? [],
    });
  } catch (error) {
    console.error('Admin dashboard query failed', error);
    return NextResponse.json({ error: 'Unable to load dashboard data' }, { status: 500 });
  }
}

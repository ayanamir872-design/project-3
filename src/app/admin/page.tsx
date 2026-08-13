"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type DashboardData = {
  metrics: {
    totalAppointments: number;
    todayAppointments: number;
    statusCounts: Record<string, number>;
    activeServices: number | null;
    totalCustomers: number | null;
    revenue: number | null;
  };
  recentAppointments: Array<{
    id: string;
    customer_name: string;
    service_name: string;
    appointment_date: string;
    appointment_time: string;
    status: string;
  }>;
  upcomingAppointments: Array<{
    id: string;
    customer_name: string;
    service_name: string;
    appointment_date: string;
    appointment_time: string;
    status: string;
  }>;
};

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="border border-[#e7ddd2] bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#756b64]">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-[#651F32]">{value}</p>
    </div>
  );
}

export default function AdminIndex() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const response = await fetch('/api/admin/dashboard', {
          credentials: 'same-origin',
        });

        const body = await response.json();
        if (!response.ok) {
          throw new Error(body?.error || 'Your admin session has expired. Please sign in again.');
        }

        if (active) setData(body);
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Unable to load dashboard');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();
    return () => { active = false; };
  }, []);

  if (loading) {
    return <section aria-busy="true"><h2 className="mb-6 text-2xl font-semibold text-[#651F32]">Dashboard</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-24 animate-pulse bg-white/70" />)}</div></section>;
  }

  if (error || !data) {
    return <section><h2 className="mb-3 text-2xl font-semibold text-[#651F32]">Dashboard</h2><div className="border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error ?? 'Dashboard data is unavailable.'}</div></section>;
  }

  const { metrics } = data;
  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-sm text-[#756b64]">Operations overview</p><h2 className="text-2xl font-semibold text-[#651F32]">Dashboard</h2></div>
        <Link href="/admin/appointments" className="bg-[#651F32] px-4 py-2 text-sm font-medium text-white">View appointments</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Total appointments" value={metrics.totalAppointments} />
        <Metric label="Today" value={metrics.todayAppointments} />
        <Metric label="Pending" value={metrics.statusCounts.pending ?? 0} />
        <Metric label="Confirmed" value={metrics.statusCounts.confirmed ?? 0} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="border border-[#e7ddd2] bg-white p-5 shadow-sm"><h3 className="mb-4 text-lg font-semibold text-[#651F32]">Upcoming appointments</h3>{data.upcomingAppointments.length === 0 ? <p className="text-sm text-[#756b64]">No upcoming appointments yet.</p> : <div className="space-y-3">{data.upcomingAppointments.map((appointment) => <div key={appointment.id} className="flex items-center justify-between gap-3 border-b border-[#eee5dc] pb-3 text-sm"><div><p className="font-medium">{appointment.customer_name}</p><p className="text-[#756b64]">{appointment.service_name}</p></div><p className="text-right text-[#756b64]">{appointment.appointment_date}<br />{appointment.appointment_time}</p></div>)}</div>}</div>
        <div className="border border-[#e7ddd2] bg-white p-5 shadow-sm"><h3 className="mb-4 text-lg font-semibold text-[#651F32]">Recent bookings</h3>{data.recentAppointments.length === 0 ? <p className="text-sm text-[#756b64]">No bookings have been recorded.</p> : <div className="space-y-3">{data.recentAppointments.map((appointment) => <div key={appointment.id} className="flex items-center justify-between gap-3 border-b border-[#eee5dc] pb-3 text-sm"><div><p className="font-medium">{appointment.customer_name}</p><p className="text-[#756b64]">{appointment.service_name}</p></div><span className="text-xs uppercase tracking-wide text-[#756b64]">{appointment.status}</span></div>)}</div>}</div>
      </div>

      <div className="mt-6 border border-[#e7ddd2] bg-[#fffaf5] p-4 text-sm text-[#756b64]">Customer totals, service totals, revenue, charts, and other CMS metrics will appear after their real database models are introduced. No placeholder business numbers are shown.</div>
    </section>
  );
}

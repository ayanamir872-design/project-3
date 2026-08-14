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
    <div className="admin-metric-card">
      <p>{label}</p>
      <strong>{value}</strong>
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
    return <section className="admin-dashboard" aria-busy="true"><div className="admin-dashboard-heading"><div><span className="admin-eyebrow">Studio operations</span><h2>Dashboard</h2></div></div><div className="admin-metrics-grid">{[1, 2, 3, 4].map((item) => <div key={item} className="admin-metric-skeleton" />)}</div></section>;
  }

  if (error || !data) {
    return <section className="admin-dashboard"><div className="admin-dashboard-heading"><div><span className="admin-eyebrow">Studio operations</span><h2>Dashboard</h2></div></div><div className="admin-alert" role="alert"><div><strong>We couldn&apos;t load the dashboard.</strong><span>{error ?? 'Dashboard data is unavailable.'}</span></div></div></section>;
  }

  const { metrics } = data;
  return (
    <section className="admin-dashboard">
      <div className="admin-dashboard-heading">
        <div><span className="admin-eyebrow">Studio operations</span><h2>Dashboard</h2><p>Keep the daily schedule visible and current.</p></div>
        <Link href="/admin/appointments" className="btn btn-primary">View appointments</Link>
      </div>

      <div className="admin-metrics-grid">
        <Metric label="Total appointments" value={metrics.totalAppointments} />
        <Metric label="Pending" value={metrics.statusCounts.pending ?? 0} />
        <Metric label="Confirmed" value={metrics.statusCounts.confirmed ?? 0} />
        <Metric label="Cancelled" value={metrics.statusCounts.cancelled ?? 0} />
      </div>

      <div className="admin-dashboard-panels">
        <div className="admin-dashboard-panel"><div className="admin-panel-heading"><div><span className="admin-panel-kicker">Schedule</span><h3>Upcoming appointments</h3></div><span>{data.upcomingAppointments.length} shown</span></div>{data.upcomingAppointments.length === 0 ? <p className="admin-dashboard-empty">No upcoming appointments yet.</p> : <div className="admin-dashboard-list">{data.upcomingAppointments.map((appointment) => <div key={appointment.id} className="admin-dashboard-row"><div><strong>{appointment.customer_name}</strong><span>{appointment.service_name}</span></div><time>{appointment.appointment_date}<br />{appointment.appointment_time}</time></div>)}</div>}</div>
        <div className="admin-dashboard-panel"><div className="admin-panel-heading"><div><span className="admin-panel-kicker">Activity</span><h3>Recent bookings</h3></div><span>{data.recentAppointments.length} shown</span></div>{data.recentAppointments.length === 0 ? <p className="admin-dashboard-empty">No bookings have been recorded.</p> : <div className="admin-dashboard-list">{data.recentAppointments.map((appointment) => <div key={appointment.id} className="admin-dashboard-row"><div><strong>{appointment.customer_name}</strong><span>{appointment.service_name}</span></div><span className={`admin-badge admin-badge--${appointment.status}`}>{appointment.status}</span></div>)}</div>}</div>
      </div>

      <div className="admin-dashboard-note">Customer totals, service totals, revenue, charts, and other CMS metrics will appear after their real database models are introduced. No placeholder business numbers are shown.</div>
    </section>
  );
}

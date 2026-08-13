"use client";

import React, { useCallback, useEffect, useState } from 'react';
import AdminAppointmentDetail from '@/components/AdminAppointmentDetail';
import { useToast, ToastContainer } from '@/components/Toast';

type Appointment = {
  id: string;
  customer_name: string;
  phone_number: string;
  service_name: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  created_at: string;
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [count, setCount] = useState(0);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  const fetchAppointments = useCallback(async (showToast = false) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('pageSize', String(pageSize));
      if (statusFilter) params.set('status', statusFilter);
      if (search) params.set('service', search);

      const resp = await fetch(`/api/admin/appointments?${params.toString()}`, {
        credentials: 'same-origin',
      });

      const body = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        throw new Error(body?.error || 'Failed to load appointments');
      }

      setAppointments(body.data ?? []);
      setCount(body.count ?? 0);
      if (showToast) addToast('success', `Refreshed: ${(body.data ?? []).length} appointments loaded`);
    } catch (err: any) {
      console.error('Failed to fetch appointments', err);
      setError(err?.message ?? 'Unable to load appointments');
      setAppointments([]);
      setCount(0);
      if (showToast) addToast('error', err?.message ?? 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, statusFilter, search, addToast]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return (
    <section className="admin-page">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="admin-header">
        <div>
          <h1 className="admin-heading">Appointments</h1>
          <p className="admin-lead">Live bookings from Supabase, newest first.</p>
        </div>

        <div className="admin-toolbar">
          <div className="admin-toolbar-row">
            <input
              placeholder="Search service"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-input"
            />
            <button className="btn btn-primary" onClick={() => { setPage(1); fetchAppointments(); }}>
              Search
            </button>
          </div>

          <div className="admin-toolbar-row">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="admin-select">
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
              <option value="no_show">No show</option>
            </select>
            <button className="btn btn-secondary disabled:opacity-50" onClick={() => fetchAppointments(true)} disabled={loading}>
              {loading ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Service</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="admin-empty">Loading latest bookings…</td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="admin-empty">No appointments found. Use Refresh to load the latest bookings.</td>
                </tr>
              ) : (
                appointments.map((appointment) => {
                  const statusClass = appointment.status === 'confirmed'
                    ? 'admin-badge--confirmed'
                    : appointment.status === 'cancelled'
                    ? 'admin-badge--cancelled'
                    : appointment.status === 'completed'
                    ? 'admin-badge--completed'
                    : 'admin-badge--pending';

                  return (
                    <tr key={appointment.id}>
                      <td>{appointment.customer_name}</td>
                      <td>{appointment.phone_number}</td>
                      <td>{appointment.service_name}</td>
                      <td>{appointment.appointment_date}</td>
                      <td>{appointment.appointment_time}</td>
                      <td>
                        <span className={`admin-badge ${statusClass}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td>{new Date(appointment.created_at).toLocaleString()}</td>
                      <td>
                        <button className="btn btn-ghost" onClick={() => setSelected(appointment)}>
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {error && <div className="admin-empty" style={{ backgroundColor: '#FCE8E9', color: '#842029', border: '1px solid #F5C2C7' }}>{error}</div>}

      <div className="admin-summary">
        <span>Total bookings: <strong>{count}</strong></span>
        <div className="admin-pagination">
          <button className="btn btn-secondary" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page === 1}>
            Prev
          </button>
          <span>Page {page}</span>
          <button className="btn btn-secondary" onClick={() => setPage((prev) => prev + 1)} disabled={appointments.length < pageSize}>
            Next
          </button>
        </div>
      </div>

      {selected && (
        <AdminAppointmentDetail
          appointment={selected}
          onClose={() => setSelected(null)}
          onUpdated={fetchAppointments}
          onToast={addToast}
        />
      )}
    </section>
  );
}

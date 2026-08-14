"use client";

import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import AdminAppointmentDetail from '@/components/AdminAppointmentDetail';
import { ToastContainer, useToast } from '@/components/Toast';

type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled';

type Appointment = {
  id: string;
  customer_name: string;
  phone_number: string;
  service_name: string;
  appointment_date: string;
  appointment_time: string;
  notes?: string | null;
  status: AppointmentStatus;
  created_at: string;
};

const STATUS_OPTIONS: Array<{ value: AppointmentStatus; label: string }> = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
];

function formatAppointmentDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
}

function formatCreatedAt(value: string) {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(value));
}

function statusClass(status: AppointmentStatus) {
  return `admin-badge admin-badge--${status}`;
}

function statusLabel(status: AppointmentStatus) {
  return status.replace('_', ' ');
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [count, setCount] = useState(0);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | ''>('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  const fetchAppointments = useCallback(async (showToast = false) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      if (statusFilter) params.set('status', statusFilter);
      if (search.trim()) params.set('service', search.trim());

      const resp = await fetch(`/api/admin/appointments?${params.toString()}`, { credentials: 'same-origin' });
      const body = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(body?.error || 'Failed to load appointments');

      const rows = body.data ?? [];
      setAppointments(rows);
      setCount(body.count ?? 0);
      if (showToast) addToast('success', `Refreshed ${rows.length} appointment${rows.length === 1 ? '' : 's'}.`);
    } catch (err: any) {
      console.error('Failed to fetch appointments', err);
      setError(err?.message ?? 'Unable to load appointments');
      setAppointments([]);
      setCount(0);
      if (showToast) addToast('error', err?.message ?? 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search, addToast]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (page === 1) fetchAppointments();
    else setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPage(1);
  };

  return (
    <section className="admin-page appointments-page" aria-labelledby="appointments-title">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <header className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Studio operations</p>
          <h1 className="admin-heading" id="appointments-title">Appointments</h1>
          <p className="admin-lead">Keep today&apos;s schedule clear, current, and easy to scan.</p>
        </div>
        <div className="admin-header-actions">
          <div className="admin-stat-card" aria-label={`${count} total appointments`}>
            <span>Total records</span>
            <strong>{count}</strong>
          </div>
          <button className="btn btn-secondary" onClick={() => fetchAppointments(true)} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </header>

      <form className="admin-toolbar-card" onSubmit={handleSearch}>
        <div className="admin-toolbar-fields">
          <div className="admin-field admin-search-field">
            <label htmlFor="appointment-search">Search services</label>
            <input id="appointment-search" className="admin-input" placeholder="e.g. Hydrafacial" value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <div className="admin-field">
            <label htmlFor="appointment-status">Status</label>
            <select id="appointment-status" className="admin-select" value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value as AppointmentStatus | ''); setPage(1); }}>
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((status) => <option value={status.value} key={status.value}>{status.label}</option>)}
            </select>
          </div>
        </div>
        <div className="admin-toolbar-actions">
          <button className="btn btn-primary" type="submit">Apply filters</button>
          <button className="btn btn-ghost" type="button" onClick={clearFilters} disabled={!search && !statusFilter}>Clear</button>
        </div>
      </form>

      {error && (
        <div className="admin-alert" role="alert">
          <div>
            <strong>We couldn&apos;t load appointments.</strong>
            <span>{error}</span>
          </div>
          <button className="btn btn-secondary" onClick={() => fetchAppointments(true)}>Try again</button>
        </div>
      )}

      <div className="admin-list-heading">
        <div>
          <h2>Appointment register</h2>
          <p>{loading ? 'Checking the latest bookings...' : `${appointments.length} shown on this page`}</p>
        </div>
        <span className="admin-list-caption">Newest first</span>
      </div>

      <div className="admin-panel" aria-busy={loading}>
        {loading ? (
          <div className="admin-loading-state"><span className="admin-loading-dot" /> Loading latest bookings...</div>
        ) : appointments.length === 0 ? (
          <div className="admin-empty-state">
            <h3>No appointments found</h3>
            <p>Try clearing the filters or refresh the register for the latest records.</p>
            <button className="btn btn-secondary" onClick={clearFilters}>Clear filters</button>
          </div>
        ) : (
          <>
            <div className="admin-appointments-desktop">
              <table className="admin-table">
                <caption className="sr-only">Appointment register</caption>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Service</th>
                    <th>Date / time</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td><strong className="admin-table-primary">{appointment.customer_name}</strong></td>
                      <td>{appointment.phone_number}</td>
                      <td>{appointment.service_name}</td>
                      <td><span className="admin-table-primary">{formatAppointmentDate(appointment.appointment_date)}</span><small>{appointment.appointment_time}</small></td>
                      <td><span className={statusClass(appointment.status)}>{statusLabel(appointment.status)}</span></td>
                      <td>{formatCreatedAt(appointment.created_at)}</td>
                      <td><button className="btn btn-ghost" onClick={() => setSelected(appointment)}>View details</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin-appointments-mobile">
              {appointments.map((appointment) => (
                <article className="admin-appointment-card" key={appointment.id}>
                  <div className="admin-appointment-card-header">
                    <div>
                      <h3>{appointment.customer_name}</h3>
                      <p>{appointment.service_name}</p>
                    </div>
                    <span className={statusClass(appointment.status)}>{statusLabel(appointment.status)}</span>
                  </div>
                  <dl className="admin-appointment-card-details">
                    <div><dt>Date</dt><dd>{formatAppointmentDate(appointment.appointment_date)}</dd></div>
                    <div><dt>Time</dt><dd>{appointment.appointment_time}</dd></div>
                    <div><dt>Phone</dt><dd>{appointment.phone_number}</dd></div>
                    <div><dt>Created</dt><dd>{formatCreatedAt(appointment.created_at)}</dd></div>
                  </dl>
                  <button className="btn btn-secondary admin-card-action" onClick={() => setSelected(appointment)}>View details</button>
                </article>
              ))}
            </div>
          </>
        )}
      </div>

      <footer className="admin-summary">
        <span>Showing page <strong>{page}</strong> of {Math.max(1, Math.ceil(count / pageSize))}</span>
        <div className="admin-pagination">
          <button className="btn btn-secondary" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1 || loading}>Previous</button>
          <button className="btn btn-secondary" onClick={() => setPage((current) => current + 1)} disabled={loading || appointments.length < pageSize}>Next</button>
        </div>
      </footer>

      {selected && (
        <AdminAppointmentDetail appointment={selected} onClose={() => setSelected(null)} onUpdated={fetchAppointments} onToast={addToast} />
      )}
    </section>
  );
}

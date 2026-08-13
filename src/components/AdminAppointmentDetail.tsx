"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AdminAppointmentDetail({ appointment, onClose, onUpdated, onToast }: { appointment: any; onClose: () => void; onUpdated?: () => void; onToast?: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReschedule, setShowReschedule] = useState(false);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [staffId, setStaffId] = useState<string | null>(appointment?.staff_id ?? null);
  const [startTs, setStartTs] = useState<string | null>(appointment?.start_ts ?? null);
  const [duration, setDuration] = useState<number>(appointment?.duration_minutes ?? 60);

  useEffect(() => {
    async function loadStaff() {
      try {
        const { data } = await supabase.from('staff').select('id,name').eq('active', true);
        setStaffList(data ?? []);
      } catch (err) {
        // if staff table/migration absent, ignore silently
        setStaffList([]);
      }
    }
    loadStaff();
  }, []);

  const apiUpdate = async (payload: any) => {
    setIsProcessing(true);
    setError(null);
    try {
      const resp = await fetch(`/api/admin/appointments/${appointment.id}`, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const body = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        throw new Error(body?.error || 'Failed to update');
      }
      onToast?.('success', 'Appointment updated successfully');
      if (onUpdated) onUpdated();
      onClose();
    } catch (err: any) {
      console.error('Update failed', err);
      setError(err?.message || String(err));
      onToast?.('error', err?.message || 'Failed to update appointment');
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmBooking = async () => {
    await apiUpdate({ status: 'confirmed' });
  };

  const cancelBooking = async () => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    await apiUpdate({ status: 'cancelled' });
  };

  const submitReschedule = async () => {
    if (!startTs) { setError('Start time required'); return; }
    const payload: any = { start_ts: startTs, duration_minutes: duration };
    if (staffId) payload.staff_id = staffId;
    await apiUpdate(payload);
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <div className="admin-modal-header">
          <div>
            <h3 className="admin-modal-title">Appointment details</h3>
            <p className="admin-modal-value">{appointment.customer_name} · {appointment.service_name}</p>
          </div>
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>

        <div className="admin-modal-grid">
          <div>
            <div className="admin-modal-label">Customer</div>
            <div className="admin-modal-value">{appointment.customer_name}</div>
            <div className="admin-modal-label mt-4">Phone</div>
            <div className="admin-modal-value">{appointment.phone_number}</div>
          </div>
          <div>
            <div className="admin-modal-label">Appointment</div>
            <div className="admin-modal-value">{appointment.appointment_date} · {appointment.appointment_time}</div>
            <div className="admin-modal-label mt-4">Status</div>
            <div className="admin-modal-value">{appointment.status}</div>
          </div>
        </div>

        {error && <div className="admin-modal-error">{error}</div>}

        <div className="admin-modal-buttons">
          <button className="btn btn-primary" onClick={confirmBooking} disabled={isProcessing}>
            {isProcessing ? 'Processing…' : 'Confirm'}
          </button>
          <button className="btn btn-gold" onClick={() => setShowReschedule((s) => !s)} disabled={isProcessing}>
            {showReschedule ? 'Close reschedule' : 'Reschedule'}
          </button>
          <button className="btn btn-secondary" onClick={cancelBooking} disabled={isProcessing}>
            {isProcessing ? 'Processing…' : 'Cancel'}
          </button>
        </div>

        {showReschedule && (
          <div className="admin-modal-panel">
            <div className="mb-4">
              <div className="admin-modal-label">Start</div>
              <input
                type="datetime-local"
                value={startTs ? startTs.replace('Z', '') : ''}
                onChange={(e) => setStartTs(e.target.value)}
                className="admin-modal-input"
              />
            </div>
            <div className="mb-4">
              <div className="admin-modal-label">Duration (minutes)</div>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value || '60'))}
                className="admin-modal-input"
              />
            </div>
            <div className="mb-4">
              <div className="admin-modal-label">Staff</div>
              <select value={staffId ?? ''} onChange={(e) => setStaffId(e.target.value || null)} className="admin-modal-select">
                <option value="">Unassigned</option>
                {staffList.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="admin-modal-buttons">
              <button className="btn btn-primary" onClick={submitReschedule} disabled={isProcessing}>
                {isProcessing ? 'Processing…' : 'Save'}
              </button>
              <button className="btn btn-secondary" onClick={() => setShowReschedule(false)} disabled={isProcessing}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type AdminAppointmentDetailProps = {
  appointment: any;
  onClose: () => void;
  onUpdated?: () => void | Promise<void>;
  onToast?: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
};

export default function AdminAppointmentDetail({ appointment, onClose, onUpdated, onToast }: AdminAppointmentDetailProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
      } catch {
        setStaffList([]);
      }
    }
    loadStaff();
  }, []);

  useEffect(() => {
    if (!showDeleteConfirm) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isDeleting) setShowDeleteConfirm(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showDeleteConfirm, isDeleting]);

  const apiUpdate = async (payload: any) => {
    setIsProcessing(true);
    setError(null);
    try {
      const resp = await fetch(`/api/admin/appointments/${appointment.id}`, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        const message = [body?.error, body?.details].filter(Boolean).join(': ');
        throw new Error(message || 'Failed to update appointment');
      }
      onToast?.('success', 'Appointment updated successfully');
      await onUpdated?.();
      onClose();
    } catch (err: any) {
      console.error('Update failed', err);
      setError(err?.message || String(err));
      onToast?.('error', err?.message || 'Failed to update appointment');
    } finally {
      setIsProcessing(false);
    }
  };

  const apiDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      const resp = await fetch(`/api/admin/appointments/${appointment.id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      const body = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        const message = [body?.error, body?.details].filter(Boolean).join(': ');
        throw new Error(message || 'Failed to delete appointment');
      }
      await onUpdated?.();
      onToast?.('success', 'Appointment deleted successfully.');
      onClose();
    } catch (err: any) {
      console.error('Delete failed', err);
      setError(err?.message || String(err));
      setShowDeleteConfirm(false);
      onToast?.('error', err?.message || 'Failed to delete appointment');
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmBooking = async () => apiUpdate({ status: 'confirmed' });

  const cancelBooking = async () => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    await apiUpdate({ status: 'cancelled' });
  };

  const submitReschedule = async () => {
    if (!startTs) {
      setError('Start time required');
      return;
    }
    const payload: any = { start_ts: startTs, duration_minutes: duration };
    if (staffId) payload.staff_id = staffId;
    await apiUpdate(payload);
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="appointment-detail-title">
        <div className="admin-modal-header">
          <div>
            <p className="admin-eyebrow">Appointment record</p>
            <h2 className="admin-modal-title" id="appointment-detail-title">Appointment details</h2>
            <p className="admin-modal-value">{appointment.customer_name} / {appointment.service_name}</p>
          </div>
          <button className="btn btn-ghost" onClick={onClose} disabled={isProcessing || isDeleting}>Close</button>
        </div>

        <div className="admin-modal-grid">
          <div>
            <div className="admin-modal-label">Customer</div>
            <div className="admin-modal-value">{appointment.customer_name}</div>
            <div className="admin-modal-label mt-4">Phone</div>
            <div className="admin-modal-value">{appointment.phone_number}</div>
            <div className="admin-modal-label mt-4">Notes</div>
            <div className="admin-modal-value">{appointment.notes || 'No notes added.'}</div>
          </div>
          <div>
            <div className="admin-modal-label">Appointment</div>
            <div className="admin-modal-value">{appointment.appointment_date} / {appointment.appointment_time}</div>
            <div className="admin-modal-label mt-4">Status</div>
            <div className="admin-modal-value">{appointment.status}</div>
            <div className="admin-modal-label mt-4">Created</div>
            <div className="admin-modal-value">{new Date(appointment.created_at).toLocaleString()}</div>
          </div>
        </div>

        {error && <div className="admin-modal-error" role="alert">{error}</div>}

        <div className="admin-modal-buttons">
          <button className="btn btn-primary" onClick={confirmBooking} disabled={isProcessing || isDeleting}>
            {isProcessing ? 'Processing...' : 'Confirm appointment'}
          </button>
          <button className="btn btn-gold" onClick={() => setShowReschedule((current) => !current)} disabled={isProcessing || isDeleting}>
            {showReschedule ? 'Close reschedule' : 'Reschedule'}
          </button>
          <button className="btn btn-secondary" onClick={cancelBooking} disabled={isProcessing || isDeleting}>
            {isProcessing ? 'Processing...' : 'Cancel appointment'}
          </button>
          <button className="btn btn-danger" onClick={() => setShowDeleteConfirm(true)} disabled={isProcessing || isDeleting}>
            Delete appointment
          </button>
        </div>

        {showReschedule && (
          <div className="admin-modal-panel">
            <div className="mb-4">
              <div className="admin-modal-label">Start</div>
              <input type="datetime-local" value={startTs ? startTs.replace('Z', '') : ''} onChange={(event) => setStartTs(event.target.value)} className="admin-modal-input" />
            </div>
            <div className="mb-4">
              <div className="admin-modal-label">Duration (minutes)</div>
              <input type="number" value={duration} onChange={(event) => setDuration(parseInt(event.target.value || '60'))} className="admin-modal-input" />
            </div>
            <div className="mb-4">
              <div className="admin-modal-label">Staff</div>
              <select value={staffId ?? ''} onChange={(event) => setStaffId(event.target.value || null)} className="admin-modal-select">
                <option value="">Unassigned</option>
                {staffList.map((staff) => <option key={staff.id} value={staff.id}>{staff.name}</option>)}
              </select>
            </div>
            <div className="admin-modal-buttons">
              <button className="btn btn-primary" onClick={submitReschedule} disabled={isProcessing || isDeleting}>
                {isProcessing ? 'Processing...' : 'Save'}
              </button>
              <button className="btn btn-secondary" onClick={() => setShowReschedule(false)} disabled={isProcessing || isDeleting}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="admin-confirm-overlay" role="presentation">
          <div className="admin-confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-appointment-title" aria-describedby="delete-appointment-description">
            <p className="admin-eyebrow">Permanent action</p>
            <h2 className="admin-confirm-title" id="delete-appointment-title">Delete appointment?</h2>
            <p className="admin-confirm-copy" id="delete-appointment-description">This permanently removes the appointment from the database.</p>
            <div className="admin-confirm-summary">
              <strong>{appointment.customer_name}</strong>
              <span>{appointment.service_name}</span>
              <span>{appointment.appointment_date} / {appointment.appointment_time}</span>
            </div>
            <div className="admin-modal-buttons admin-confirm-actions">
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting}>Keep appointment</button>
              <button className="btn btn-danger" onClick={apiDelete} disabled={isDeleting}>{isDeleting ? 'Deleting...' : 'Delete appointment'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

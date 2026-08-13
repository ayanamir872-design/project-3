export const APPOINTMENT_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'] as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export type ParsedAppointmentInput = {
  ok: true;
  customerId: string | null;
  serviceId: string | null;
  staffId: string | null;
  status: AppointmentStatus;
  customerName: string;
  phoneNumber: string;
  serviceName: string;
  notes: string;
  adminNotes: string;
  durationMinutes: number;
  startAt: Date | null;
  endAt: Date | null;
  legacyDate: string | null;
  legacyTime: string | null;
};

export type ParsedAppointmentFailure = {
  ok: false;
  status: number;
  error: string;
  details?: string;
};

export function sanitizeAppointmentStatus(value: unknown): AppointmentStatus {
  const normalized = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (normalized && APPOINTMENT_STATUSES.includes(normalized as AppointmentStatus)) {
    return normalized as AppointmentStatus;
  }
  return 'pending';
}

export function parseAppointmentStartAt(
  value: unknown,
  legacyDate: unknown,
  legacyTime: unknown,
  durationMinutesRaw: unknown,
): { startAt: Date | null; endAt: Date | null; durationMinutes: number; legacyDate: string | null; legacyTime: string | null } {
  const durationMinutes = Number(durationMinutesRaw ?? 60);
  const safeDuration = Number.isFinite(durationMinutes) && durationMinutes > 0 ? Math.min(Math.max(Math.round(durationMinutes), 15), 480) : 60;

  const legacyDateString = typeof legacyDate === 'string' ? legacyDate.trim() : '';
  const legacyTimeString = typeof legacyTime === 'string' ? legacyTime.trim() : '';

  const normalizedValue = typeof value === 'string' ? value.trim() : '';
  if (normalizedValue) {
    const candidate = new Date(normalizedValue);
    if (Number.isNaN(candidate.getTime())) {
      throw new Error('Invalid appointment date/time.');
    }
    const endAt = new Date(candidate.getTime() + safeDuration * 60 * 1000);
    return { startAt: candidate, endAt, durationMinutes: safeDuration, legacyDate: legacyDateString || candidate.toISOString().slice(0, 10), legacyTime: legacyTimeString || candidate.toISOString().slice(11, 16) };
  }

  if (!legacyDateString || !legacyTimeString) {
    return { startAt: null, endAt: null, durationMinutes: safeDuration, legacyDate: legacyDateString || null, legacyTime: legacyTimeString || null };
  }

  const legacyCandidate = new Date(`${legacyDateString}T${legacyTimeString}:00`);
  if (Number.isNaN(legacyCandidate.getTime())) {
    throw new Error('Invalid appointment date/time.');
  }

  const endAt = new Date(legacyCandidate.getTime() + safeDuration * 60 * 1000);
  return { startAt: legacyCandidate, endAt, durationMinutes: safeDuration, legacyDate: legacyDateString, legacyTime: legacyTimeString };
}

export function parseAppointmentRequest(body: any): ParsedAppointmentInput | ParsedAppointmentFailure {
  if (!body || typeof body !== 'object') {
    return { ok: false, status: 400, error: 'Invalid booking payload.' };
  }

  const customerId = typeof body.customer_id === 'string' && body.customer_id.trim() ? body.customer_id.trim() : null;
  const serviceId = typeof body.service_id === 'string' && body.service_id.trim() ? body.service_id.trim() : null;
  const staffId = typeof body.staff_id === 'string' && body.staff_id.trim() ? body.staff_id.trim() : null;

  const customerName = String(body.customer_name ?? body.customer ?? '').trim();
  const phoneNumber = String(body.phone_number ?? body.phone ?? '').trim();
  const serviceName = String(body.service_name ?? body.service ?? '').trim();
  const notes = String(body.notes ?? body.customer_notes ?? '').trim();
  const adminNotes = String(body.admin_notes ?? body.internal_notes ?? '').trim();

  if (!customerId && customerName.length < 2) {
    return { ok: false, status: 400, error: 'Invalid customer', details: 'A valid customer name is required.' };
  }

  if (!customerId && phoneNumber.length < 7) {
    return { ok: false, status: 400, error: 'Invalid customer', details: 'A valid customer phone number is required.' };
  }

  if (!serviceId && serviceName.length < 2) {
    return { ok: false, status: 400, error: 'Invalid service', details: 'A valid service is required.' };
  }

  try {
    const { startAt, endAt, durationMinutes, legacyDate, legacyTime } = parseAppointmentStartAt(
      body.start_at ?? body.appointment_start_at ?? null,
      body.appointment_date ?? body.date ?? null,
      body.appointment_time ?? body.time ?? null,
      body.duration_minutes ?? 60,
    );

    if (!startAt || !endAt) {
      return { ok: false, status: 400, error: 'Invalid date/time', details: 'A valid appointment date and time are required.' };
    }

    return {
      ok: true,
      customerId,
      serviceId,
      staffId,
      status: sanitizeAppointmentStatus(body.status),
      customerName: customerName || 'Guest customer',
      phoneNumber: phoneNumber || 'Unavailable',
      serviceName: serviceName || 'General service',
      notes,
      adminNotes,
      durationMinutes,
      startAt,
      endAt,
      legacyDate,
      legacyTime,
    };
  } catch (error) {
    return {
      ok: false,
      status: 400,
      error: 'Invalid date/time',
      details: error instanceof Error ? error.message : 'Appointment time could not be parsed.',
    };
  }
}

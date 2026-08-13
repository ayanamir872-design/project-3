-- 002_add_appointments_unique_date_time.sql

-- Create a partial unique index to prevent double-booking for non-cancelled appointments
CREATE UNIQUE INDEX IF NOT EXISTS unique_appointments_date_time
ON public.appointments (appointment_date, appointment_time)
WHERE status IS DISTINCT FROM 'cancelled';

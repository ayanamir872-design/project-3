-- 005_appointment_booking_foundation.sql
-- Build the appointment domain foundation without replacing the legacy fields.

create extension if not exists pgcrypto;
create extension if not exists btree_gist;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null default '',
  email text,
  phone text,
  notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customers_identity_check
    check (
      (char_length(trim(first_name)) > 0)
      and (
        (phone is not null and char_length(trim(phone)) >= 7)
        or (email is not null and char_length(trim(email)) > 0)
      )
    )
);

create unique index if not exists customers_phone_unique_idx
  on public.customers (lower(phone))
  where phone is not null;

create unique index if not exists customers_email_unique_idx
  on public.customers (lower(email))
  where email is not null;

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text,
  duration_minutes integer not null default 60 check (duration_minutes > 0),
  price numeric(10,2),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.appointments
  add column if not exists customer_id uuid,
  add column if not exists service_id uuid,
  add column if not exists appointment_start_at timestamptz,
  add column if not exists appointment_end_at timestamptz,
  add column if not exists admin_notes text default '',
  add column if not exists internal_notes text default '',
  add column if not exists source text default 'web',
  add column if not exists booking_channel text default 'web';

alter table public.appointments
  add constraint appointments_customer_fk
  foreign key (customer_id) references public.customers(id) on delete set null;

alter table public.appointments
  add constraint appointments_service_fk
  foreign key (service_id) references public.services(id) on delete set null;

alter table public.appointments
  add constraint appointments_duration_check
  check (duration_minutes is null or duration_minutes > 0);

alter table public.appointments
  add constraint appointments_time_window_check
  check (
    appointment_start_at is null
    or appointment_end_at is null
    or appointment_end_at > appointment_start_at
  );

alter table public.appointments
  add constraint appointments_status_check
  check (status in ('pending','confirmed','completed','cancelled','no_show'));

create index if not exists appointments_customer_idx
  on public.appointments (customer_id);

create index if not exists appointments_service_idx
  on public.appointments (service_id);

create index if not exists appointments_start_at_idx
  on public.appointments (appointment_start_at);

create index if not exists appointments_status_idx
  on public.appointments (status);

-- Prevent same-provider overlaps, even when legacy columns continue to be used.
do $$
begin
  if exists (
    select 1 from pg_constraint
    where conname = 'appointments_no_overlap'
      and conrelid = 'public.appointments'::regclass
  ) then
    alter table public.appointments drop constraint appointments_no_overlap;
  end if;
end $$;

alter table public.appointments
  add constraint appointments_no_overlap
  exclude using gist (
    staff_id with =,
    tstzrange(
      coalesce(appointment_start_at, start_ts),
      coalesce(appointment_end_at, start_ts + make_interval(mins => duration_minutes)),
      '[)'
    ) with &&
  ) where (status is distinct from 'cancelled' and staff_id is not null and (appointment_start_at is not null or start_ts is not null));

create or replace function public.has_conflict(p_staff uuid, p_start timestamptz, p_duration integer, p_exclude uuid default null)
returns boolean
language sql stable
as $$
  select exists(
    select 1
    from public.appointments a
    where a.staff_id = p_staff
      and a.status is distinct from 'cancelled'
      and (
        tstzrange(
          coalesce(a.appointment_start_at, a.start_ts),
          coalesce(a.appointment_end_at, a.start_ts + make_interval(mins => a.duration_minutes)),
          '[)'
        ) && tstzrange(p_start, p_start + make_interval(mins => p_duration), '[)')
      )
      and (p_exclude is null or a.id <> p_exclude)
  );
$$;

-- keep the legacy date/time uniqueness for backward compatibility
create unique index if not exists unique_appointments_date_time
on public.appointments (appointment_date, appointment_time)
where status is distinct from 'cancelled';

-- 003_staff_and_schedule_constraints.sql

create extension if not exists btree_gist;

-- Staff table
create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text default 'staff',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.staff enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'staff'
      and policyname = 'admins_can_read_staff'
  ) then
    create policy "admins_can_read_staff"
      on public.staff
      for select
      to authenticated
      using (public.is_admin());
  end if;
end
$$;

-- Add scheduling columns to appointments
alter table public.appointments
  add column if not exists staff_id uuid,
  add column if not exists duration_minutes integer not null default 60,
  add column if not exists start_ts timestamptz;

-- Add generated end_ts column if supported
alter table public.appointments
  add column if not exists end_ts timestamptz generated always as (start_ts + make_interval(mins => duration_minutes)) stored;

-- Add foreign key to staff (nullable)
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'appointments_staff_fk'
      and conrelid = 'public.appointments'::regclass
  ) then
    alter table public.appointments
      add constraint appointments_staff_fk foreign key (staff_id) references public.staff(id) on delete set null;
  end if;
end
$$;

-- Add exclusion constraint to prevent overlapping appointments for same staff (non-cancelled)
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'appointments_no_overlap'
      and conrelid = 'public.appointments'::regclass
  ) then
    alter table public.appointments
      add constraint appointments_no_overlap
      exclude using gist (
        staff_id with =,
        tstzrange(start_ts, end_ts) with &&
      ) where (status is distinct from 'cancelled' and staff_id is not null and start_ts is not null);
  end if;
end
$$;

-- Add helper function to check for conflicts via RPC
create or replace function public.has_conflict(p_staff uuid, p_start timestamptz, p_duration integer, p_exclude uuid default null)
returns boolean
language sql stable
as $$
  select exists(
    select 1 from public.appointments a
    where a.staff_id = p_staff
      and a.status is distinct from 'cancelled'
      and tstzrange(a.start_ts, a.end_ts) && tstzrange(p_start, p_start + make_interval(mins => p_duration))
      and (p_exclude is null or a.id <> p_exclude)
  );
$$;

-- 001_create_admin_profiles_and_audit_logs.sql

create extension if not exists pgcrypto;

-- Admin profiles
create table if not exists public.admin_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role text not null check (role in ('superadmin','admin','staff')),
  display_name text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admin_profiles enable row level security;

-- Allow authenticated users to read admin profiles. This supports role checks,
-- but should be narrowed before production if profile data becomes sensitive.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'admin_profiles'
      and policyname = 'Allow select for authenticated users on admin_profiles'
  ) then
    create policy "Allow select for authenticated users on admin_profiles"
      on public.admin_profiles
      for select
      to authenticated
      using (true);
  end if;
end
$$;

create index if not exists admin_profiles_user_id_idx
  on public.admin_profiles (user_id);

-- Audit logs
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid,
  actor_display text,
  action text not null,
  entity text,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_created_at_idx
  on public.audit_logs (created_at desc);

-- Appointments RLS tightening: require admin role to read/write via RLS (service role bypasses RLS)
alter table public.appointments enable row level security;

create or replace function public.is_admin() returns boolean
  language sql stable
  as $$
    select exists(
      select 1 from public.admin_profiles where user_id = auth.uid() and role in ('superadmin','admin','staff')
    );
  $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'appointments'
      and policyname = 'admins_can_manage_appointments'
  ) then
    create policy "admins_can_manage_appointments"
      on public.appointments
      for all
      to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;
end
$$;

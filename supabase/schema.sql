create extension if not exists pgcrypto;

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone_number text not null,
  service_name text not null,
  appointment_date date not null,
  appointment_time text not null,
  notes text default '',
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


alter table public.appointments enable row level security;

-- Helper to check if current user is an admin (superadmin/admin/staff)
create or replace function public.is_admin() returns boolean
  language sql stable
  as $$
    select exists(
      select 1 from public.admin_profiles where user_id = auth.uid() and role in ('superadmin','admin','staff')
    );
  $$;

-- Only allow select/insert/update/delete for admin users via RLS.
-- Note: the Supabase service_role key bypasses RLS and can perform writes from server-side.
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

-- Public booking requests can be inserted with the publishable key after
-- server validation. Public clients have no select/update/delete policy.
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'appointments'
      and policyname = 'public_can_create_pending_appointments'
  ) then
    create policy "public_can_create_pending_appointments"
      on public.appointments
      for insert
      to anon, authenticated
      with check (
        status = 'pending'
        and char_length(trim(customer_name)) between 2 and 120
        and char_length(trim(phone_number)) between 7 and 30
        and char_length(trim(service_name)) between 2 and 120
        and char_length(appointment_time) between 3 and 20
        and (notes is null or char_length(notes) <= 1000)
        and appointment_date >= current_date
      );
  end if;
end
$$;

create index if not exists appointments_created_at_idx
  on public.appointments (created_at desc);

-- Admin profiles & roles
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

-- Users may read only their own admin profile for server-side role checks.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'admin_profiles'
      and policyname = 'Users can read their own admin profile'
  ) then
    drop policy if exists "Allow select for authenticated users on admin_profiles"
      on public.admin_profiles;
    create policy "Users can read their own admin profile"
      on public.admin_profiles
      for select
      to authenticated
      using ((select auth.uid()) = user_id);
  end if;
end
$$;

-- Do NOT allow inserts/updates/deletes from client-side authenticated roles.
-- The Supabase service_role key bypasses RLS and should be used server-side for writes.

create index if not exists admin_profiles_user_id_idx
  on public.admin_profiles (user_id);

-- Simple audit log
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

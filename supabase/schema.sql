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

create policy if not exists "Allow public inserts for appointments"
  on public.appointments
  for insert
  to anon
  with check (true);

create policy if not exists "Allow public reads for appointments"
  on public.appointments
  for select
  to anon
  using (true);

create index if not exists appointments_created_at_idx
  on public.appointments (created_at desc);

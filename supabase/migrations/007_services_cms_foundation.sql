-- Central services source of truth. This migration is safe for the current
-- production schema, which still contains legacy appointment service fields.

create extension if not exists pgcrypto;

-- Keep the existing authorization helper deterministic when called by RLS.
alter function public.is_admin() set search_path = public;

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  short_description text not null default '',
  description text not null default '',
  image_url text,
  price numeric(10,2),
  currency text not null default 'PKR',
  duration_minutes integer not null default 60,
  category text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint services_name_check check (char_length(trim(name)) between 2 and 160),
  constraint services_slug_check check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint services_price_check check (price is null or price >= 0),
  constraint services_currency_check check (currency ~ '^[A-Z]{3}$'),
  constraint services_duration_check check (duration_minutes between 1 and 1440),
  constraint services_sort_order_check check (sort_order >= 0)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at
before update on public.services
for each row execute function public.set_updated_at();

create index if not exists services_active_sort_idx
  on public.services (is_active, sort_order, created_at);
create index if not exists services_name_search_idx
  on public.services (lower(name));
create index if not exists services_category_search_idx
  on public.services (lower(category));

alter table public.appointments
  add column if not exists service_id uuid,
  add column if not exists service_price_at_booking numeric(10,2),
  add column if not exists service_currency_at_booking text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'appointments_service_fk'
      and conrelid = 'public.appointments'::regclass
  ) then
    alter table public.appointments
      add constraint appointments_service_fk
      foreign key (service_id) references public.services(id) on delete restrict;
  end if;
end
$$;

create index if not exists appointments_service_idx
  on public.appointments (service_id);

alter table public.services enable row level security;

drop policy if exists "Public can read active services" on public.services;
drop policy if exists "Public and admins can read services" on public.services;
create policy "Public and admins can read services"
  on public.services
  for select
  to anon, authenticated
  using (is_active = true or public.is_admin());

drop policy if exists "Admins can manage services" on public.services;
drop policy if exists "Admins can create services" on public.services;
create policy "Admins can create services"
  on public.services
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update services" on public.services;
create policy "Admins can update services"
  on public.services
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete services" on public.services;
create policy "Admins can delete services"
  on public.services
  for delete
  to authenticated
  using (public.is_admin());

grant select on public.services to anon, authenticated;
grant insert, update, delete on public.services to authenticated;

insert into public.services
  (name, slug, category, short_description, description, image_url, currency, duration_minutes, is_active, sort_order)
values
  ('HYDRAFACIAL', 'hydrafacial', 'Skincare & Facials', 'Deep cleansing, gentle exfoliation, pore extraction, and intense hydration.', 'Deep cleansing, gentle exfoliation, pore extraction, and intense peptide hydration designed to reveal a fresh, luminous complexion.', '/images/services/hydrafacial.png', 'PKR', 60, true, 10),
  ('NAIL ART', 'nail-art', 'Nail Artistry', 'Refined nail artistry designed around your personal style.', 'Refined nail artistry designed around your personal style, from understated minimalist elegance to intricate statement details.', '/images/services/nail-art.jpg', 'PKR', 90, true, 20),
  ('EYELASHES ART', 'eyelashes-art', 'Lash & Brow Studio', 'Beautifully defined lashes with an elegant, effortless finish.', 'Beautifully defined lashes designed to enhance your natural features with an elegant, weightless, effortless finish.', '/images/services/eyelashes-art.jpg', 'PKR', 90, true, 30),
  ('HAIRSTYLING', 'hairstyling', 'Hair Studio', 'Bespoke styling tailored to your texture, occasion, and personal flair.', 'Bespoke blowouts, couture updos, and hair health rituals tailored to your texture, occasion, and personal flair.', '/images/services/hairstyling.png', 'PKR', 90, true, 40),
  ('MAKE UP', 'makeup', 'Makeup Artistry', 'Editorial glam, soft romantic looks, and evening makeup.', 'Editorial glam, soft romantic looks, and evening makeup designed to enhance your natural beauty and confidence.', '/images/services/makeup.png', 'PKR', 90, true, 50),
  ('BRIDAL MAKE-UP', 'bridal-makeup', 'Bridal Studio', 'Luxury bridal packages for a flawless, timeless look.', 'Exclusive luxury bridal packages from engagement to the big day for a flawless, timeless bridal look.', '/images/services/bridal-makeup.png', 'PKR', 180, true, 60),
  ('SIGNATURE GLOWING FACIAL', 'glowing-facial', 'Skincare & Facials', 'A custom botanical facial infusion for natural radiance.', 'Custom botanical facial infusion engineered to restore skin elasticity, tone, and deep natural radiance.', '/images/about-philosophy.png', 'PKR', 75, true, 70),
  ('LUXE MANICURE & PEDICURE SPA', 'luxe-manicure-pedicure-spa', 'Nail Artistry', 'Nourishing cuticle care, exfoliation, and precision shaping.', 'Nourishing cuticle care, organic exfoliation scrub, and precision shaping with gel or classic finish.', '/images/services/nail-art.jpg', 'PKR', 120, true, 80),
  ('BROW SCULPTING & LAMINATION', 'brow-sculpting-lamination', 'Lash & Brow Studio', 'Custom brow mapping, lamination, and bespoke tinting.', 'Custom architectural brow mapping, gentle lamination, and bespoke tinting for fuller, polished brows.', '/images/services/eyelashes-art.jpg', 'PKR', 60, true, 90)
on conflict (slug) do nothing;

-- Existing service names remain valid legacy snapshots. Resolve them to the
-- new stable IDs wherever an exact case-insensitive match is available.
update public.appointments a
set service_id = s.id,
    service_price_at_booking = coalesce(a.service_price_at_booking, s.price),
    service_currency_at_booking = coalesce(a.service_currency_at_booking, s.currency)
from public.services s
where a.service_id is null
  and lower(trim(a.service_name)) = lower(trim(s.name));

-- Require the public booking path to use an active authoritative service and
-- to persist the same service snapshot that was validated by the API.
drop policy if exists "public_can_create_pending_appointments" on public.appointments;
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
    and exists (
      select 1
      from public.services s
      where s.id = service_id
        and s.is_active = true
        and s.name = service_name
        and service_price_at_booking is not distinct from s.price
        and service_currency_at_booking = s.currency
    )
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('service-images', 'service-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']::text[])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins can upload service images" on storage.objects;
create policy "Admins can upload service images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'service-images' and public.is_admin());

drop policy if exists "Admins can update service images" on storage.objects;
create policy "Admins can update service images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'service-images' and public.is_admin())
  with check (bucket_id = 'service-images' and public.is_admin());

drop policy if exists "Admins can delete service images" on storage.objects;
create policy "Admins can delete service images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'service-images' and public.is_admin());

-- Keep the existing admin_profiles.user_id -> auth.users.id relationship
-- enforced by the authorization query without exposing all profiles.
alter table public.admin_profiles enable row level security;

drop policy if exists "Allow select for authenticated users on admin_profiles"
  on public.admin_profiles;
drop policy if exists "Users can read their own admin profile"
  on public.admin_profiles;

create policy "Users can read their own admin profile"
  on public.admin_profiles
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- Preserve the validated public booking insert policy, but remove legacy
-- policies that exposed appointment rows or allowed unconstrained inserts.
alter table public.appointments enable row level security;

drop policy if exists "Allow public reads for appointments"
  on public.appointments;
drop policy if exists "Allow public inserts for appointments"
  on public.appointments;

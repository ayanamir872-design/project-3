# AIMA GLOW STUDIO - PROJECT HANDOFF

## 1. Project Overview

Aima Glow Studio is a Next.js salon website with a public booking drawer and an early Admin CMS. The public site presents services, about content, testimonials, contact information, and a booking request form. The Admin CMS currently covers login, a real appointment-backed dashboard summary, appointments, and admin-user management only.

## 2. Current Technology Stack

- Next.js 15.5 App Router
- React 19
- TypeScript 5.7 with strict mode
- Supabase JS 2.112 and `@supabase/ssr`
- Supabase Postgres/Auth/Storage intended backend
- Netlify plugin dependency present
- No configured ESLint file; `next lint` prompts for setup

## 3. Current Architecture

- Frontend: App Router pages under `src/app`, reusable client components under `src/components`.
- Public shell: `src/components/SiteShell.tsx` renders public header/footer/booking provider outside admin routes.
- Admin shell: `src/components/AdminShell.tsx` renders login without guard, and guarded sidebar/header layout for other admin routes.
- Backend: Route handlers under `src/app/api`.
- Database: SQL schema and migrations under `supabase/`.
- Authentication: Supabase magic-link login using browser client session persistence.
- Storage: No verified Supabase Storage buckets, policies, upload UI, or media metadata implementation.
- Admin authorization: Admin APIs validate Bearer token with Supabase Auth and check `admin_profiles.role` server-side; a shared authorization helper now exists for new routes.

## 4. Admin Routes

- `/admin/login` - magic-link login page.
- `/admin` - appointment-backed dashboard summary with loading, error, and empty states.
- `/admin/appointments` - appointment list and detail actions.
- `/admin/settings/admins` - admin profile listing/creation UI.

Sidebar links also point to `/admin/services`, `/admin/media`, `/admin/customers`, `/admin/staff`, `/admin/reviews`, and `/admin/settings`, but those routes do not exist.

## 5. Completed Features

- Public marketing pages exist.
- Public booking form exists and posts to `/api/bookings`.
- Admin route shell exists.
- Admin APIs perform server-side token validation before admin appointment/profile actions.
- Dashboard metrics and recent/upcoming appointment lists are queried from Supabase; unavailable domains are not represented with fake numbers.
- Public unauthenticated appointment listing was removed from `/api/bookings`.
- Admin login route is no longer wrapped by `AdminGuard`.
- Browser Supabase auth now persists and refreshes sessions.

## 6. Partial Features

- Appointments: create/list/update/status/reschedule paths exist, but real database execution and end-to-end flows need Supabase verification.
- Admin users: profile UI/API exists, but email lookup uses a questionable `auth.users` query path and needs real Supabase verification.
- Staff scheduling: SQL migration adds staff and overlap constraints, but no full staff management UI exists.
- Audit logs: inserts exist in admin APIs, but no viewer and no RLS policy is defined.

## 7. Broken Features

- ESLint cannot run because no ESLint config exists and `next lint` prompts interactively.
- Sidebar links to non-existent admin pages.
- Media/gallery/customers/reviews/promotions/content/notifications/analytics/settings are not implemented.

## 8. Not Started

- Services CMS
- Media/image upload CMS
- Gallery management
- Customer management
- Full staff management UI
- Staff availability UI
- Reviews/testimonials CMS
- Promotions CMS
- Website content CMS
- Notifications
- Analytics using real data
- Business settings
- Audit log viewer
- Role/permission matrix beyond `superadmin`, `admin`, `staff`

## 9. Files Created

- `src/app/admin/layout.tsx` - admin route layout using `AdminShell`; status: partial.
- `src/app/admin/login/page.tsx` - magic-link login; status: partial.
- `src/app/admin/page.tsx` - placeholder dashboard; status: partial.
- `src/app/admin/appointments/page.tsx` - appointments table/detail entry; status: partial.
- `src/app/admin/settings/admins/page.tsx` - admin user UI; status: partial.
- `src/app/api/admin/check-role/route.ts` - validates current admin role; status: partial.
- `src/app/api/admin/onboard/route.ts` - initial superadmin onboarding; status: needs verification.
- `src/app/api/admin/appointments/route.ts` - admin appointment list/create; status: partial.
- `src/app/api/admin/appointments/[id]/route.ts` - admin appointment update; status: partial.
- `src/app/api/admin/profiles/route.ts` - admin profile list/create; status: partial.
- `src/app/api/admin/profiles/[id]/route.ts` - admin profile update/delete; status: partial.
- `src/components/AdminGuard.tsx` - client admin authorization gate; status: partial.
- `src/components/AdminHeader.tsx` - admin header/sign-out; status: partial.
- `src/components/AdminSidebar.tsx` - admin navigation; status: partial.
- `src/components/AdminAppointmentDetail.tsx` - appointment actions modal; status: partial.
- `src/components/AdminShell.tsx` - admin shell and login bypass; status: partial.
- `src/components/SiteShell.tsx` - hides public shell on admin routes; status: complete for current routing.
- `src/lib/supabaseAdminClient.ts` - server-only service-role client helper; status: partial.
- `src/types/admin.ts` - appointment type; status: partial.
- `supabase/migrations/001_create_admin_profiles_and_audit_logs.sql` - admin profiles/audit/RLS migration; status: partial.
- `supabase/migrations/002_add_appointments_unique_date_time.sql` - date/time uniqueness migration; status: partial.
- `supabase/migrations/003_staff_and_schedule_constraints.sql` - staff/scheduling constraints migration; status: partial.

## 10. Files Modified

- `src/app/layout.tsx` - moved public header/footer/booking provider into `SiteShell` to avoid rendering them on admin routes.
- `src/app/api/bookings/route.ts` - removed unauthenticated appointment GET, required service role for writes, added basic validation and same-slot conflict check.
- `src/lib/supabaseClient.ts` - enabled auth session persistence and refresh for admin login.
- `supabase/schema.sql` - tightened appointments RLS from public read/insert to admin-only authenticated access; added admin profile/audit schema.
- `supabase/migrations/001_create_admin_profiles_and_audit_logs.sql` - replaced unsupported `create policy if not exists` with guarded DO blocks.
- `supabase/migrations/003_staff_and_schedule_constraints.sql` - enabled staff RLS and replaced unsupported `add constraint if not exists` with guarded DO blocks.

## 11. Files Deleted

No important project files were intentionally deleted.

## 12. Files Renamed/Moved

No project files were intentionally renamed or moved.

## 13. Database Changes

- `appointments`: core booking fields, status check, timestamps; migrations add `staff_id`, `duration_minutes`, `start_ts`, generated `end_ts`.
- `admin_profiles`: `user_id`, `role`, `display_name`, `email`, timestamps.
- `audit_logs`: actor/action/entity/metadata timestamps.
- `staff`: name, role, active flag, timestamps.
- Indexes: appointments created date, unique non-cancelled appointment date/time, admin profile user id, audit log created date.
- Constraints/functions: `public.is_admin()`, `public.has_conflict(...)`, optional staff FK, staff overlap exclusion constraint.
- Verification caveat: SQL has not been applied to a real Supabase project in this session.

## 14. RLS / Security

- `appointments` RLS enabled; authenticated users must pass `public.is_admin()` for direct table access.
- Public booking writes use a server route with the publishable Supabase key and a narrow RLS insert policy; the service role is not used in browser code. Admin routes remain service-role protected.
- `admin_profiles` RLS enabled with broad authenticated read policy; this supports role checks but should be narrowed before production.
- `staff` RLS enabled in migration 003 with admin read policy.
- `audit_logs` currently has no RLS enabled/policy in inspected SQL; this needs correction before production.
- No evidence of service-role key exposure via `NEXT_PUBLIC_` variables.

## 15. API Endpoints

- `POST /api/bookings`: public booking creation, basic validation, service-role insert, same date/time conflict check.
- `GET /api/bookings`: returns 405.
- `GET /api/admin/check-role`: Bearer token validation and profile role lookup.
- `POST /api/admin/onboard`: creates first superadmin if no admin profiles exist.
- `GET /api/admin/appointments`: admin-only list with pagination/filtering.
- `POST /api/admin/appointments`: admin-only appointment creation.
- `PUT /api/admin/appointments/[id]`: admin-only status/update/reschedule.
- `GET /api/admin/profiles`: admin/superadmin list admin profiles.
- `POST /api/admin/profiles`: superadmin creates admin profile.
- `PUT /api/admin/profiles/[id]`: superadmin updates admin profile.
- `DELETE /api/admin/profiles/[id]`: superadmin deletes admin profile.

## 16. Appointment System

Current behavior: public customer booking can insert pending appointments through `/api/bookings`; admins can list and update appointments through admin APIs; confirm/cancel/reschedule actions exist in UI. Double booking prevention exists through API pre-checks and a date/time unique index migration, with optional staff overlap logic when staff/start time are supplied.

Needs verification: real Supabase insert/update, RLS behavior, generated `end_ts`, `has_conflict`, staff assignment, reschedule UI updating displayed date/time, and race-condition handling around conflict checks.

## 17. Media System

No verified media system exists. There are static public image assets under `public/images`, but no Supabase Storage bucket configuration, upload route, metadata table, MIME/size validation, delete/replace workflow, gallery association, or service image association.

## 18. Verification Status

- TypeScript: PASS with `npx.cmd tsc --noEmit --incremental false --tsBuildInfoFile nul`.
- ESLint: NOT CONFIGURED. `npm.cmd run lint` opens Next's interactive ESLint setup prompt.
- Tests: NOT FOUND.
- Production build: PASS with `npm.cmd run build`.

## Build Stabilization

- `.next` was tracked by Git even though `.next/` was already present in `.gitignore`.
- Generated `.next` artifacts were removed from Git tracking with `git rm -r --cached .next`.
- Local `.next` was removed and regenerated by a clean production build.
- `*.tsbuildinfo` was added to `.gitignore`, and local `tsconfig.tsbuildinfo` compiler output was removed.
- No package versions or build configuration files were changed.
- Build output now regenerates under ignored `.next/` and `git ls-files .next` returns no tracked files.
- The clean build emitted runtime warnings that `SUPABASE_SERVICE_ROLE_KEY` is not configured; the value was not printed or written anywhere.

## Verification

- TypeScript: PASS with `npx.cmd tsc --noEmit --incremental false --tsBuildInfoFile nul`.
- Production Build: PASS with `npm.cmd run build`.
- ESLint: NOT CONFIGURED. `npm.cmd run lint` prompts for initial ESLint setup.

## 19. Known Issues

- HIGH: Runtime environments need `SUPABASE_SERVICE_ROLE_KEY` for privileged admin writes/profile management. Admin dashboard and role reads can fall back to the signed-in user's publishable-key client under RLS. Public booking no longer requires the secret, but migration `004_public_booking_insert_policy.sql` must be applied.
- HIGH: `audit_logs` lacks RLS policy/enablement in inspected SQL.
- HIGH: `admin_profiles` authenticated read policy is broad.
- HIGH: Admin profile creation by email queries `auth.users` via `.from('auth.users')`, which likely does not work through Supabase Data API.
- HIGH: No real Supabase project/RLS test was run.
- MEDIUM: Dashboard currently reports appointment metrics only; services, customer totals, charts, revenue, and other analytics require real database models.
- MEDIUM: Admin routes linked from sidebar are missing.
- MEDIUM: Appointment status UI includes `completed` and `no-show`, but base schema only allows `pending`, `confirmed`, `cancelled`.
- MEDIUM: `AdminHeader` quick action points to missing `/admin/new`.
- LOW: Generated `tsconfig.tsbuildinfo` is untracked.

## 20. Technical Debt

- Add non-interactive ESLint config compatible with Next 15.
- Migrate remaining admin API routes to the shared admin token/role verification helper.
- Add runtime validation schemas for API payloads.
- Add integration tests for booking/admin APIs.
- Replace broad profile RLS with least-privilege policies or server-only profile access.
- Add database migration verification against a real Supabase environment.

## Current Project State

The project now has a reproducible clean TypeScript and production-build baseline. Public website and early Admin CMS source work remain intact. Admin appointment/profile functionality is still partial and requires real Supabase backend verification before production readiness.

## Last Completed Task

Fixed public booking configuration by removing its dependency on the service-role key, adding a publishable-key server client, adding a narrow public appointment-insert RLS migration, and verifying a local booking request returns HTTP 201. Added the same authenticated publishable-key fallback for admin role/dashboard reads; no admin authorization was weakened.

## 21. Remaining Work

RLS hardening, real Supabase verification, runtime environment verification, ESLint setup, services CMS, media/gallery CMS, customer management, staff availability, reviews/promotions/content CMS, notifications, analytics, settings, audit log viewer, complete dashboard metrics, and end-to-end test coverage.

## 22. Recommended Next Step

Verify the Supabase backend and RLS behavior against the real project. This is the next priority because the build now passes, and production readiness is blocked by unverified database policies, runtime service-role configuration, and appointment/admin API behavior.

## 23. NEXT SESSION INSTRUCTION

Read PROJECT_HANDOFF.md first.

Do not repeat completed work.

Do not recreate existing components.

Inspect the current repository before making changes.

Continue from the remaining work and recommended next step documented in this file.

Verify existing functionality before modifying it.

## Feature Matrix

| Feature | Status | Implementation | Backend | Security | UI | Testing | Notes |
|---|---|---|---|---|---|---|---|
| Authentication | PARTIAL | Magic-link login exists | Supabase Auth | Server role check exists | Login page exists | TypeScript only | Needs real magic-link verification |
| Admin Dashboard | PARTIAL | Appointment-backed summary page and API | Appointments table | Shared server role check on dashboard API | Loading/error/empty states | TypeScript + production build | Service/customer/revenue analytics not modeled yet |
| Admin Roles | PARTIAL | `admin_profiles.role` | Table/API exist | Server checks exist | Admin users page | None | No full permission matrix |
| Admin Profiles | PARTIAL | UI/API exist | Table exists | Broad read policy | List/create UI | None | Email lookup likely broken |
| RLS | PARTIAL | Policies in SQL | Some tables protected | Needs hardening | N/A | Not verified | Audit logs missing RLS |
| Audit Logs | PARTIAL | API inserts exist | Table exists | Missing RLS | No viewer | None | Needs policy and UI |
| Appointments | PARTIAL | List/detail/actions | Table/API exist | Admin APIs check roles | Table/modal | TypeScript only | Needs Supabase E2E |
| Appointment Creation | PARTIAL | Public/admin create routes | Insert exists | Public via server service role | Public drawer/admin API | TypeScript only | Needs DB verification |
| Appointment Confirmation | PARTIAL | Status update button | PUT route exists | Admin role check | Modal button | None | Schema status supports confirmed |
| Appointment Cancellation | PARTIAL | Status update button | PUT route exists | Admin role check | Modal button | None | Schema status supports cancelled |
| Appointment Rescheduling | PARTIAL | Modal accepts start/duration/staff | PUT route/RPC exists | Admin role check | Basic form | None | Date/time display not fully updated |
| Double Booking Prevention | PARTIAL | API check + index migration | Unique index/RPC | Server-side check | Error path | Not verified | Race handling relies on DB index |
| Staff Management | NOT STARTED | No CRUD UI | Staff table migration | RLS policy added | Staff select only | None | Sidebar route missing |
| Staff Availability | NOT STARTED | None | None | None | None | None | Not implemented |
| Services | NOT STARTED | Static services only | None | None | Sidebar link only | None | CMS missing |
| Media / Image Upload | NOT STARTED | Static images only | No storage config | None | Sidebar link only | None | Upload missing |
| Gallery | NOT STARTED | None | None | None | Sidebar link only | None | Not implemented |
| Customers | NOT STARTED | None | None | None | Sidebar link only | None | Not implemented |
| Reviews | NOT STARTED | Static testimonials only | None | None | Sidebar link only | None | CMS missing |
| Promotions | NOT STARTED | None | None | None | None | None | Not implemented |
| Website CMS | NOT STARTED | None | None | None | None | None | Static pages |
| Notifications | NOT STARTED | None | None | None | None | None | Not implemented |
| Analytics | NOT STARTED | Placeholder only | None | None | Dashboard placeholders | None | Not implemented |
| Settings | PARTIAL | Admin users subpage | Profile APIs | Role checks | One subpage | None | Business settings missing |

# Complete ScholarScout workflows

## User-facing changes

Build the missing signed-in student and admin workflows using the existing ScholarScout styling and existing data services:

- Profile setup and editing, including optional matching fields and a clear save/skip path.
- Live discovery search, job progress, candidate sources, extraction outcomes, saved results, and a clear configuration error when live search credentials are unavailable.
- Saved opportunities and application tracking, including status, notes, applied date, and official-required document checklist completion.
- A conversational assistant that calls the existing protected, source-grounded assistant service.
- Admin-only opportunity review, approval/rejection, issue review, and source re-check actions, with server-verified admin permissions.

Add shared signed-in navigation/entry points where useful, keep all existing public routes, and give each new content route unique page metadata. Do not fabricate live search results or claim an application was submitted or reminders were sent.

## Technical approach

Reuse the existing Supabase browser client, row-level security, AuthProvider, server functions, eligibility helpers, shared buttons/forms, and status types. Add narrowly scoped route pages and a reusable authenticated-workspace navigation pattern. Any added server operation must use `createServerFn` and authenticated middleware; check admin roles on the server before privileged actions. Do not change database schema unless inspection shows a required field is missing. Preserve the configured AI model/call behavior. Since TinyFish credentials are currently absent, retain its real integration and show a truthful setup state rather than substituting demo success.

## Verification

Run existing routing tests and the project build, resolve all reported errors, inspect route metadata for every route, and exercise public routes and the reachable signed-out experience. Validate authenticated or TinyFish-dependent paths only if preview credentials permit; otherwise record those exact limits.

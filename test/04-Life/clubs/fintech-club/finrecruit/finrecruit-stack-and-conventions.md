---
type: project
date: 2026-09-30
tags: [club, fintech-club, finrecruit, architecture, conventions]
---

# FinRecruit - stack and conventions

Up: [[finrecruit]] · Look and feel: [[finrecruit-design-system]] · Applies to: [[finrecruit-epic-2]]

## Stack
- Next.js 16 App Router, TypeScript, Tailwind v4 (shadcn/radix-style tokens, oklch/lab colors, dark mode via `.dark`), MongoDB/Mongoose, NextAuth (Google) plus a custom `Session` model for force-logout.
- Strict split: `src/app/(backend)` = API routes/models/libs/middleware only; `src/app/(frontend)/(router)/<RouteName>` = pages.
- Every server write is wrapped in `withRBAC` / `withActiveRBAC` and logged via `logSystemEvent`. Client writes use `credentials: 'include'`.
- `src/middleware.ts` only guards known authenticated route prefixes and `/`; everything else and all `/api/*` passes through. New public no-login routes need no middleware change.
- Sources of truth: `Candidate.status` (`Pending|Pass|Fail`) and `HEAD_DEPARTMENTS` (`src/app/(backend)/libs/departments.ts`) for Phase 1 / Epic 1 UI. The new backend models instead import `DEPARTMENTS` from `src/app/(backend)/types/index.ts` - same four names defined twice. Worth knowing, not necessarily worth fixing.

## The mock/http-api pattern (established convention; Epic 2 must follow it)
Each frontend feature gets `src/lib/<feature>/`:
- `api.ts` - public interface the UI calls; exports one object per function and a `getXApi()` picker returning mock or real by `process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'false'` (mock is default, real is opt-in).
- `mock-store.ts` - in-memory state and mutators.
- `http-api.ts` - real `fetch()` calls, written up front against the endpoint path/method/body it will need.
- `reducer.ts` - small pure helpers for derived state (e.g. "how many departments locked").
- `seed.ts` (optional) - seed data.
- plus `src/hooks/use-<feature>.ts` wrapping `api.ts` for components.

Existing examples: `src/lib/member-directory/`, `src/lib/round-transition/` - both mock-only today; their endpoints don't exist yet (see [[finrecruit-epic-1]]). Workflow: ship frontend on mock, later edit only `http-api.ts` and flip the env flag - no component changes.

**Epic 2 should use `src/lib/interview-scheduling/` with this same five-file shape**, not one ad-hoc mock module.

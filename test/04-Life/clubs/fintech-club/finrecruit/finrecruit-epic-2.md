---
type: project
date: 2026-09-30
tags: [club, fintech-club, finrecruit, epic-2, todo]
---

# FinRecruit - Epic 2 (my task): interview scheduling

Up: [[finrecruit]] · Build convention: [[finrecruit-stack-and-conventions]] · UI: [[finrecruit-design-system]] · Depends on: [[finrecruit-epic-1]] (round lock produces the Round 2 pool)

**Status: not started.**

## Scope (confirmed with the project owner)
- Epic 2 only: the two-step interview scheduling system. Not Epics 1, 3, 4, 5.
- Frontend only, using the mock/http-api pattern: `src/lib/interview-scheduling/` with `api.ts`, `mock-store.ts`, `http-api.ts`, `reducer.ts`, `seed.ts`, plus `src/hooks/use-interview-scheduling.ts`.
- Out of scope: the Department Head's own "Interview Schedule" tab (Figma, `HeadDashboard`, Round 2 mode).
- In scope: the Executive Board `MasterViewDashboard` screens (sub-nav: Interview Schedule / Interviewer Availability / Candidate Bookings) and the two public, no-login links.
- Per-screen detail, copy, and the use-case flow: `EPIC2_DESIGN_SPEC.md` (external file).

## Backend scaffolding that already exists (schema only, no API routes use it)
Models in `src/app/(backend)/models/`, types in `src/app/(backend)/types/index.ts`.

- **`MasterInterviewSlot`** - `generation`, `semester`, `date` (real `Date`), `startTime`, `endTime`, `room`, `status` (`'AVAILABLE' | 'BOOKED'`), `bookedByCandidateId` (nullable ref to `Candidate`). Flat single-status model: one slot, one booking total, any department. This matches the Figma "Candidate Bookings - All Departments" table (a slot booked by one department is blocked for the others in that room/time), so it is *more* correct than the earlier per-department-array idea. Revisit `EPIC2_IMPLEMENTATION.md` to match this shape.
- **`InterviewerAvailability`** - `slotId` (ref), `department`, `interviewerName` (string), `isHead` (boolean). No email, no role beyond `isHead`. The Figma form collects email and a three-way role (Executive Board / Department Head / Member). Reconcile: extend the model, or keep those fields mock-only for now.
- **`DepartmentConfig`** - `department`, `generation`, `semester`, `interviewQuestions` (string[]), `isScoringEnabled`. Belongs to Epics 3/5; Epic 2 should not touch it.

## Open questions / to-do
- [ ] Decide: extend `InterviewerAvailability` (email, role) or keep mock-only
- [ ] Update mock data shapes in `EPIC2_IMPLEMENTATION.md` to the flat `MasterInterviewSlot`
- [ ] Bring `EPIC2_DESIGN_SPEC.md` and `EPIC2_IMPLEMENTATION.md` into this vault if wanted (they are outside it now)
- [ ] Build `src/lib/interview-scheduling/` (five-file shape) then the EB screens and the two public links

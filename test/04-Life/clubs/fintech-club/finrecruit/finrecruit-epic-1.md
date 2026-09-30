---
type: project
date: 2026-09-30
tags: [club, fintech-club, finrecruit, epic-1, done]
---

# FinRecruit - Epic 1 (done): F1 round transition and F5 Member role

Up: [[finrecruit]] · Roles: [[finrecruit-roles-and-navigation]] · Pattern: [[finrecruit-stack-and-conventions]] · Next: [[finrecruit-epic-2]]

**F1 - Round 1 closure and transition.** Frontend only, on the `round-transition` mock store. A Head sees the lock button once no candidate in their department is Pending; confirming puts the department in "locked" state, makes their dashboard read-only for Round 1 / unlocks Round 2, and fills `round2Candidates` (their passed candidates). The Executive Board sees every department's lock state in the Overview Department Transition Strip.

**F5 - Member role and RBAC expansion.** `Member` added to the role enum and `role-routes.ts`. A Head can grant Member (own department only) to anyone in the waiting room via `/HeadDashboard/user-management` and `MemberGrantPanel` - currently on the `member-directory` mock store. The Executive Board's separate, broader Users page can set any role in any department. A granted Member lands on `/MemberDashboard` (placeholder).

**Not done for real:** the backend endpoints these expect do not exist as route files:
- `/api/head-dashboard/lock-round-1`
- `/api/head-dashboard/round-states`
- `/api/head-dashboard/members`

`docs/api-docs.md` is stale (still "Phase 1"); don't treat it as a picture of what's live.

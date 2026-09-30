---
type: project
date: 2026-09-30
tags: [club, fintech-club, finrecruit, rbac, navigation]
---

# FinRecruit - roles and navigation

Up: [[finrecruit]] · See also [[finrecruit-epic-1]] (where Member was added), [[finrecruit-epic-2]]

## Roles (`ROLES` constant, four exist; `Member` was added by Epic 1)

| Role | Lands on (`getHomePathForRole`) | Can do |
|---|---|---|
| Guest | `/waiting-room` | Nothing yet; static "access is being reviewed" screen until someone changes their role |
| Member | `/MemberDashboard` | Scoped to one department. Placeholder ("Round 2 interviews are coming soon"); Epic 3's interview cockpit will live here |
| Department Head | `/HeadDashboard` | Runs Round 1 evaluation for their department, runs their own Round 1 lock, grants Member role to guests in their department |
| Executive Board | `/MasterViewDashboard` | Full access: candidates, user management (any role), system config, system logs, per-department Round 1 lock overview |

A Head or Member is tied to exactly one department (`session.user.department`). Executive Board is not tied to a department.

## Navigation as it exists now

**Guest** - Google sign-in -> `/waiting-room`: three-step card (account registered -> executive review -> access granted) and sign out. Waits for role change, then signs in again.

**Member** - `/MemberDashboard`: shared header plus one placeholder card. Dead end by design until Epic 2/3.

**Department Head** - `/HeadDashboard`, two tabs:
- **Candidates** (default): Round 1 board (list/grid, search, status filter) with a **Round 1 / Round 2** pill switch. Round 1 = existing Pending/Pass/Fail board with Phase 1 reroute logic. Round 2 is disabled (lock icon) until the department has locked Round 1, then shows the passed-candidate pool (`round2Candidates`). A **Round Transition Bar** shows evaluated/total and a "Confirm & Lock Round 1" button, disabled while any candidate is Pending; confirm dialog: "Passed candidates move to the Round 2 interview pool and Round 1 becomes read-only. This cannot be undone from the dashboard."
- **User Management** (`/HeadDashboard/user-management`): waiting guests for this department + granted members, "Grant Member Role" per guest with confirm dialog.

**Executive Board** - `/MasterViewDashboard`, flat pill nav: Overview / Candidates / Users / System Config / System Logs (no dropdown restructuring exists in code, whatever a design file shows).
- Overview has the new **Department Transition Strip**: "N / 4 departments locked", progress bar, Locked / In progress chip per department.
- Candidates: read-only master view with Excel export. Users: any account's role/department/active status; the only place that can promote to Department Head or Executive Board. System Config: generation/semester cohorts and the recruitment intake toggle. System Logs: audit trail.

Nothing links the four authenticated areas to each other except the shared header (theme toggle, sign out).

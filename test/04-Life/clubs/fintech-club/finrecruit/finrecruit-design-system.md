---
type: project
date: 2026-09-30
tags: [club, fintech-club, finrecruit, ui, design-system]
---

# FinRecruit - UI design system in use

Up: [[finrecruit]] · Conventions: [[finrecruit-stack-and-conventions]] · Used by: [[finrecruit-epic-2]]

Confirmed from component source and a live DOM/style extraction of `/waiting-room` (ground truth, not inferred).

- **Shared shell `DashboardAppShell`** (every authenticated page + waiting room). Props: `title`, `badgeLabel`, `badgeVariant` (e.g. `"yellow"`), `userName`, `userInitial`, `userAvatar`, `userSubtitle`. Header: `border-b`, 64px tall, `0 32px` padding, white, flex `justify-between`. Left: 36x36 rounded logo + `h1` title (`text-base font-black`, truncates). Right: role/department badge pill (`rounded-xl`, `6px 16px`, light amber), divider, Font Awesome moon dark-mode toggle, "Sign out" (hidden on mobile), name/email (truncates past 160px), 40x40 avatar (hidden on mobile). Main: `flex-1`, scrollable, 32px padding, faint gray tint (`bg-muted/30`), content in `max-w-7xl`.
- **Cards:** shadcn `Card`/`CardHeader`/`CardContent`/`CardTitle`/`CardDescription`; header grid with small gaps; content `space-y-3/4/6`. New Epic 2 screens should use the Card family, not custom divs.
- **Role/status badges:** light amber pill (about `lab(97 -4.5 27)`); no new badge color needed for role-like things.
- **Secondary/tab nav** (`HeadDashboardShell`, `ExecutiveDashboardShell`, `RoundModeTabs`): `bg-muted/40` pill track of rounded-lg buttons; active `bg-blue-600 text-white shadow-sm`; inactive `text-muted-foreground hover:text-foreground`. Disabled: lock icon, reduced opacity, `cursor-not-allowed`, explanatory `title`. Epic 2's EB sub-nav (Interview Schedule / Interviewer Availability / Candidate Bookings) copies this.
- **Confirm dialogs:** `ConfirmDialog` (used by `RoundTransitionBar`, `MemberGrantPanel`) - prefer it; older `ConfirmModal` exists.
- **Feedback banners:** `AppNotice` (variants at least `info`, `error`; dismissible) for success and failure after actions.
- **Progress bars:** `bg-muted` track, inner `bg-green-500` fill by percentage; reuse.
- **Icons:** Font Awesome (`fa-solid fa-*`, older shell) and `lucide-react` (`Lock`, `Clock`, `Mail`, `ShieldCheck`; newer code leans lucide).

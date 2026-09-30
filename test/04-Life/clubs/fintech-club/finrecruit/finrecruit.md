---
type: project
date: 2026-09-30
tags: [club, fintech-club, finrecruit, project, hub]
---

# FinRecruit (RMIT Vietnam FinTech Club)

Hub note. Source: master project context pasted 2026-09-30 (reflects the codebase as it stood then: Phase 1 + Epic 1 complete, Epic 2 not started).

**What it is:** the internal recruitment platform for the RMIT Vietnam FinTech Club, replacing manual Google Sheets. Departments (fixed set): Technology, Business, Marketing, Human Resources.

**Pipeline**
- **Phase 1** - application intake + Round 1 evaluation. Built, in production.
- **Phase 2** - Interview & Evaluation (Round 2), across 5 Epics. Epic 1 done. **Epic 2 is my task (frontend only).** Epics 3-5 don't exist yet.

**Status (2026-09-30):** Epic 1 done. Epic 2 frontend done (mock mode); backend handoff in [[epic2-summary]].

## Notes
- [[finrecruit-roles-and-navigation]] - four roles, where each lands, full navigation
- [[finrecruit-stack-and-conventions]] - stack, backend/frontend split, the mock/http-api pattern
- [[finrecruit-design-system]] - shell, cards, badges, tabs, dialogs, banners, icons
- [[finrecruit-epic-1]] - what was built (F1 round lock, F5 Member role) and what's still mock-only
- [[finrecruit-epic-2]] - my scope, backend scaffolding discovered, open questions
- [[epic2-summary]] - Epic 2 frontend handoff for backend: test paths, endpoints, logic rules, gaps

## External files the codebase context refers to (not in this vault yet)
- `EPIC2_DESIGN_SPEC.md` - every Epic 2 screen's colors, typography, copy, states; 19 Figma frames -> 11 screens
- `EPIC2_IMPLEMENTATION.md` - build plan and prompts, written *before* the backend scaffolding was discovered; treat its mock data shapes as a starting point only
- `docs/api-docs.md` (in the repo) - stale, still "Phase 1"

Related: [[2026-09-30]]

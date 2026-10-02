---
type: reference
date: 2026-10-01
tags: [career, portfolio, resume, cv]
---

# Project Portfolio Content

Source material for the resume and portfolio website. Projects 1–4 came from reviewing the actual repos (Pathos, Together, FinReCruit, GAIT-ASM3) via Claude Code + repomix — those sections are the most reliable. Projects 5–9 came from a master file the user supplied, sourced from his existing portfolio website copy, with **no codebase reviewed** — treat their stated numbers/claims as self-reported until verified. Each project has a summary, role, stack, what was built, and ready-to-paste resume bullets. Anything not confirmed is marked **[VERIFY]** — see the checklist at the end.

Related: [[about_me]] (has a shorter "Projects & Achievements" narrative) · [[lessons-learned]]

| Project | Role | Stack | Type |
|---|---|---|---|
| Pathos (Job Access Assist) | Product Manager | Flutter, OpenAI, WebView + JS | ADC Hackathon 2026, 3-person team |
| Together | Frontend Developer | Flutter (backend: FastAPI + MongoDB) | RMIT group-work management app |
| FinReCruit | Frontend Developer | Next.js, React, TypeScript, Tailwind | RMIT Vietnam FinTech Club recruitment platform |
| GAIT-ASM3 | Part I Developer and QA [VERIFY] | Python, Pygame, tabular RL | RMIT reinforcement learning assignment |
| TicTacToang | Frontend Specialist | React, Node.js, Socket.IO, MongoDB | RMIT Full Stack Dev 2026A course project |
| EventX | Backend Specialist | Java, PostgreSQL, JPA, REST | RMIT assignment, 81/100 (High Distinction) |
| Railway Management System | Database & Application Developer | Oracle APEX, SQL, Java OOP | University database project, 80/100 (top in cohort) |
| FlowGuard | Led development | Next.js, Python, Supabase | Hackathon — 1st place, RMIT Hack-A-Venture (100+ teams) |
| Stock Trading RL System (DSTC 2025) | Developer [VERIFY] | Python, PyTorch, Telegram API, FiinQuantX | Competition — 2nd place (1st Runner-Up), Data Science Talent Competition |

---

## 1. Pathos (Job Access Assist)

**Role: Product Manager**

### Summary

A voice-driven Android app that helps blind and low-vision people get through the job application process on their own. Built in 72 hours for the ADC Hackathon 2026 (21–23 Sep 2026), Technological Solutions category, Visual Impairment focus area. Assigned stage: Job Search and Application.

Targets four barriers named in the competition brief:
- Job descriptions posted as images.
- Job portals that screen readers cannot navigate.
- PDF application forms that are not screen-reader friendly.
- The step of filling in and submitting the application itself.

### One-liner for the portfolio

> A voice-first AI agent that reads image-based job posts aloud, narrates inaccessible job portals, reads PDF application forms, and fills in and submits an application field by field. A blind user stays in control at every step.

### Product work I owned

- **Reframed the problem after the brief came out.** Team started with a Shopee voice-ordering idea; re-scoped to Stage 2 (Job Search and Application) and locked VietnamWorks as the single real test target. Old framing kept struck-through in the intent document for decision trail.
- **Wrote the planning documents that drove the build.** Chain: intent → spec → scaffolder → plan → design → accessibility checklist, each generated from the ones before it. Contains a problem statement, one primary persona, success criteria, a "done" checklist with testable scenarios, and a rubric-mapping table tied to judging criteria (any new idea must serve a rubric line or go into Open Questions).
- **Prioritised the features.**
  - Feature 1, "AI Auto-Pilot" (must-have): image-to-speech, portal narration, PDF reading, field-by-field form-fill loop.
  - Feature 2, "Guided TalkBack Assist" (should-have), built only if Feature 1 works end to end, marked unproven until a feasibility spike confirms it.
- **Defined three hard-stop checkpoints:** confirm the listing, confirm before final submit, take over at a CAPTCHA (audio challenge tried first).
- **Stated a scope boundary on ethics.** AI-screening bias on the employer side explicitly out of scope; imitating sighted browsing patterns to evade screening would be deception, not accessibility — not built, and said so in the deck.
- **Planned the work for a 3-engineer team.**
  - Split into three parallel workstreams: A (WebView and content perception), B (app shell, state machine, accessibility), C (AI, voice, testing, demo).
  - Risk register naming the single load-bearing assumption (reading the DOM of a real third-party site), with a stop-and-reassess rule if it fails.
  - Integration checkpoint so mock-only work could not drift from real data.
  - **47 self-contained milestones**, each with preconditions and a definition of done.
- **Set the architecture decisions with the engineers.**
  - No custom backend (deliberate 72h scope cut, key-exposure trade-off documented).
  - Finite state machine for flow control; invalid transitions logged, not thrown.
  - Real submit action gated on state, never on AI text.
  - In-app WebView with injected JavaScript chosen over an Android AccessibilityService (which has a known blind spot on WebView content).
  - Lighter layered architecture chosen over full Clean Architecture.
- **Set the accessibility bar.** WCAG 2.2 AA + Universal Design principles, applied from the spec stage. Examples: a live-region text readout so status is still announced if text-to-speech fails; captions on the demo video.
- **Managed open questions,** incl. validating Feature 2 with real users at the fireside chat (team has no lived screen-reader experience), and whether profile entry needs its own settings UI.

### Technical shape of the product

- Flutter app, Android first, ~7k lines of Dart. Local state split three ways: SharedPreferences (settings), sqflite (applicant profile), secure storage (sensitive fields).
- FSM flow: Idle → Listening → ParsingIntent → LoadingTarget → ReadingContent → AwaitingUserAction → FillingForm (confirm each field) → FinalReview (edit-field loop-back) → AwaitingSubmitConfirmation → Done. Error states wrap the failed state so a retry returns to it.
- In-app WebView (`flutter_inappwebview`) with injected JavaScript reads the page and fills fields; messages restricted to allowed origins (target is an uncontrolled third-party site).
- PDF text/form-field extraction (`syncfusion_flutter_pdf`), with on-device OCR fallback for scanned PDFs.
- OpenAI API for five tasks: intent parsing, image-to-text, page summarisation, PDF structuring, form-field matching.
  - Cheap fuzzy match runs first; AI match below 0.7 confidence asks the user instead of acting.
  - Speech-to-text results below a confidence threshold trigger a re-prompt.
- Bilingual narration (English/Vietnamese) in one lookup table, mirrored on screen.
- 123 automated test cases: state-machine transitions (incl. submit firing only from the confirmation state), voice gating, fuzzy matching, the OpenAI service, accessibility guideline checks.

### Status (as stated in the repo)

- Code for milestones 1–44 is in place.
- Not yet done: real-device runs (milestones 25, 43, 45) and the demo video/slide deck (46, 47).
- OpenAI prompts were tested only against a scripted client, never the live model. **Do not claim they were validated end to end.**

### Resume bullets

- Led product definition for a voice-driven Android job-application assistant for blind and low-vision users, built in 72 hours for the ADC Hackathon 2026 (Technological Solutions, Visual Impairment track).
- Re-scoped the product after the competition brief to four verified barriers in the job application journey, and locked one real test platform (VietnamWorks) so the demo could run end to end.
- Wrote an intent-to-plan document chain and broke the work into 47 dependency-ordered milestones across three parallel engineering workstreams.
- Defined three human-in-the-loop checkpoints (listing confirmation, final submit, CAPTCHA hand-off) and required that submission be gated by application state, not AI output.
- Set WCAG 2.2 AA and Universal Design requirements from the specification stage, and documented a clear ethical boundary around AI-screening bias.

### Updated from master file (2026-10-01)

- **Date:** 2026-09. **Team:** 3 engineers (Software Engineering majors).
- **Fuller stack list:** Flutter, Dart, OpenAI API, `flutter_inappwebview`, JavaScript injection, `syncfusion_flutter_pdf`, `google_mlkit_text_recognition` (on-device OCR), `sqflite`, `flutter_secure_storage`, `speech_to_text`, `flutter_tts`.
- **Status, more precisely:** "Hackathon build, code in place, on-device testing incomplete."
- Not-done list also includes a TalkBack scanner pass (milestone 25), alongside real-device runs (43, 45) and demo video/deck (46, 47).

---

## 2. Together

**Role: Frontend Developer**

### Summary

A group-work allocation and tracking app for RMIT students and lecturers. Supports four roles (student, educator, officer, admin) and covers courses, project teams, task assignment, progress review and deadline alerts. Frontend: Flutter, ~17.7k lines of Dart. Backend: FastAPI + MongoDB + JWT.

### One-liner for the portfolio

> A role-based Flutter app that lets lecturers set up courses and projects, students plan and submit tasks with photo proof, and admins manage users, backed by a FastAPI and MongoDB API.

### What I built (frontend)

- **Feature-first Flutter architecture.** Eight feature modules (login, dashboard, projects, manage_courses, tasks, admin, account, support), each: screen → `ChangeNotifier` hook → HTTP service → typed models (`fromJson`). State via `provider`.
- **Authentication and session handling.**
  - Login flow calling `POST /auth/login`, maps 401/404 to friendly messages, restores session on launch.
  - Singleton `UserContext` holds the signed-in user's role and course IDs in memory.
  - Token expiry handled after 24 hours.
- **Role-aware UI and route guards.** `RouteGuard` redirects unauthenticated users, shows access-denied screens for role/course checks. Dashboard bottom nav and visible actions change per role. Backend remains the real enforcement point.
- **Course and project management screens.**
  - Course CRUD with semester logic (S1 Mar–May, S2 Jul–Sep, S3 Nov–Jan).
  - Educator/student chip inputs with type-ahead search.
  - Project creation/editing, leader assignment, task assignment, per-course team view, project schedule on a calendar widget.
- **Task workflow.**
  - Task creation/detail screens with comments.
  - Status/category filtering loads all tasks once, filters in memory, per-project cache, request-sequence guard so a slow stale response can't overwrite a newer one.
  - Photo proof submission (up to 5 images, base64) with subtask approval states.
- **Notifications.**
  - Event bus drives in-app and local notifications for project creation, task assignment, uploaded proof.
  - Periodic deadline notifier alerts members inside a 7-day window, avoids repeat alerts.
- **Admin tools.** User management across all four role collections, password reset/update flows, user-activity log screen.
- **Theming.** Light/dark mode persisted per user, Poppins typography, shared colour palette.
- **Frontend documentation.** Folder map, request flow, route/permission table, use-case walkthroughs per role.

### Engineering lesson worth mentioning

Traced a recurring "user shows as Guest after login" bug to three overlapping session sources: in-memory `UserContext`, legacy SharedPreferences keys, and a mock database used by some screens. On Flutter Web the async preference read resolved after the first build, so screens used default roles. Fixed the dashboard to read from the in-memory context, wrote up remaining screens and the consolidation plan. Good debugging-state-ownership-across-async-boundaries story.

### Honest notes

- Parts of the app still read from an in-memory mock database (notifications, some project status logic); repo has only the default widget test. Describe as a working app with mock-backed pieces, not fully integrated.
- A comment in the task detail screen credits a teammate for that UI. **[VERIFY]** list only the screens you personally built.

### Resume bullets

- Built the Flutter frontend (~17.7k lines of Dart) for a role-based group-project management app serving students, lecturers, officers and admins, integrated with a FastAPI and MongoDB backend over a JWT-secured REST API.
- Designed a feature-first architecture (screen → hook → service → model) using Provider, with route guards and role-aware navigation for four user roles.
- Implemented task workflows with in-memory filtering, response caching and race-condition protection, plus photo-proof submission and approval states.
- Added event-driven local notifications and a deadline-alert scheduler, with light and dark theming.
- Diagnosed and documented a multi-source session-state bug (in-memory, persisted and mock sources disagreeing on Flutter Web) and proposed a single-source fix.

### Updated from master file (2026-10-01)

- **Date:** unknown **[VERIFY]**.
- **Fuller stack list:** Flutter, Dart, Provider, FastAPI, MongoDB, JWT, Firebase Auth, `flutter_local_notifications`.

---

## 3. FinReCruit

**Role: Frontend Developer**

### Summary

An internal recruitment platform for the RMIT Vietnam FinTech Club ([[finrecruit]]), replacing manual spreadsheets with one system for application intake, candidate evaluation, role authorization and interview scheduling. Stack: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Radix/shadcn, NextAuth with Google sign-in, MongoDB via Mongoose.

### One-liner for the portfolio

> A role-based recruitment dashboard for a student club: department heads evaluate candidates, executives manage rounds and users, and candidates self-book interview slots, with an audit trail on every action.

### What I built (frontend)

Frontend work is roughly 12.5k lines of TypeScript/TSX — the Phase 1 screens plus Epic 1 and Epic 2 features.

- **Executive Board dashboard.** Candidate statistics and department charts; user management (promote/demote); system configuration for generations/semesters with a recruitment on/off switch; global candidate view with filters and Excel export of pass/fail lists; system log (audit) viewer.
- **Department Head dashboard.** Candidate board (list and grid views), candidate detail modal; pass/fail/reroute evaluation (failing a candidate's first choice sends them to their second-choice department); waiting room for new sign-ins.
- **Epic 1 – Round transition and member directory.** "Confirm and Lock Round 1" control with progress bar (disabled while any candidate pending); Round 2 mode showing passed-candidate pool as read-only; status strip on Executive view; member-grant panel for the waiting room. 7 reviewable screens.
- **Epic 2 – Interview scheduling.**
  - Executive: slot configuration with publish, interviewer availability, candidate bookings by department, share-link modals.
  - Public: interviewer availability forms (Executive/Head/Member roles), candidate booking form with confirm modal, states for slot-unavailable and already-booked.
  - 18 frames across 11 screens.
- **Reusable components.** Slot picker, slot chips, date tabs, segmented control, candidate table and modal, `AppNotice` (inline alerts), `ConfirmDialog`/`ConfirmModal` (destructive actions), shared dashboard shell with persisted dark mode.

### Engineering decisions worth mentioning

- **Mock-first delivery behind an adapter.** Each feature has an API interface, an HTTP implementation, and a mock store with a reducer; one environment flag switches mock/real, so the frontend was demoable before the backend existed. Wrote frontend handoff docs for backend developers (endpoints, response codes, logic rules, data-model gaps, known gotchas).
- **State with `useSyncExternalStore`.** Mock stores exposed as external stores to avoid tearing and hydration problems.
- **Defensive UX for races and trust.** Lock button disabled in UI while candidates pending, but server must re-check (client never trusted). Booking handles `SLOT_NO_LONGER_AVAILABLE` and `ALREADY_BOOKED` for stale tabs.
- **Polling that respects the tab.** `useIntervalWhenVisible` hook pauses refresh when the tab is hidden (Page Visibility API).
- **Hydration fix.** Moved `<html>`/`<body>` to the root layout so nested layouts no longer cause a mismatch.
- **Accessibility touches.** Landmark labels on sections, theme follows system preference, consistent feedback components.

### Honest notes

- Epic 1 and Epic 2 docs say the read hooks are still mock-only and need switching to API-backed fetches — don't claim end-to-end integration for those screens.
- Epic 2 frame 19 (Department Head interview schedule tab) was not built.
- Member Round 2 interview cockpit is a placeholder.
- **[VERIFY]** whether you built the Phase 1 screens or joined for Epics 1 and 2 — list only what applies.

### Resume bullets

- Built frontend features in Next.js 16, React 19, TypeScript and Tailwind for a club recruitment platform with Executive Board, Department Head and Member roles and Google SSO.
- Delivered round-lock and member-directory flows and a self-service interview scheduling system (18 frames, 11 screens) for executives, interviewers and candidates.
- Introduced an adapter-and-mock-store pattern behind a feature flag so UI work proceeded independently of the backend, and wrote endpoint and logic handoff specs for the backend team.
- Handled stale-slot booking conflicts, hydration issues and tab-aware polling, and built reusable confirmation, notice and slot-picker components.

### Updated from master file (2026-10-01)

- **Date:** unknown **[VERIFY]**.
- **Fuller stack list:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Radix UI, shadcn, NextAuth, MongoDB, Mongoose, ExcelJS.
- **Status, more precisely:** "Frontend done on mock store for Epics 1 and 2; read hooks still need switching to the real API."
- **Roles note:** Guest sign-ins wait in a "waiting room" until promoted — a fourth role alongside Executive Board, Department Head, Member.

---

## 4. GAIT-ASM3 (Reinforcement Learning)

**Role: Part I Developer and QA** **[VERIFY]** exact title (RL developer, QA lead, test owner).

### Summary

A two-part reinforcement learning assignment at RMIT (40% of the assessment).
- **Part I (my part):** classical tabular RL in a Pygame gridworld, 7 levels of increasing difficulty. Algorithms: Q-learning, SARSA, Expected SARSA (extension).
- **Part II (teammates):** deep RL with Stable-Baselines3 (PPO, DQN) controlling a ship in a real-time arena under two control schemes. No evidence found of involvement in Part II — mentioned only as context.

### One-liner for the portfolio

> A visually rendered gridworld where tabular RL agents learn to collect apples, open key-and-chest puzzles and avoid fire and random-walking monsters across seven levels, with live training, replay of saved policies, and a test suite that pins every rule of the spec.

### What I built and verified (Part I)

- **Environment (`env.py`).** Headless, no Pygame dependency (unit-testable). Level loader raises errors naming the file and problem. Fixed 8-step order per turn: agent move, fire death, monster-tile death, pickups, win check, monster moves, monster-contact death, step counter. Monsters move with probability 0.4 in a random unblocked direction, driven by a seeded RNG.
- **State design.** Hazards encoded relative to the agent (bearing + distance bucket to nearest monster, plus per-direction threat level covering every monster and fire tile), not absolute coordinates — keeps the Q-table small enough to learn within the training budget.
- **Algorithms (`algorithms.py`).** Q-learning (off-policy), SARSA (on-policy), Expected SARSA. Epsilon-greedy with random tie-breaking, linear epsilon schedule. JSON save/load of Q-tables. Terminal transitions do not bootstrap.
- **Trainer (`trainer.py`).** Single training loop supporting all three algorithms, optional rendering, per-episode CSV logging, optional intrinsic bonus. Logged returns always use environment reward only, never the bonus.
- **Intrinsic reward (`intrinsic.py`).** Count-based bonus `strength / sqrt(n(s))`, reset every episode, applied on Level 6 (reuses Level 4's layout so the bonus is the only variable).
- **Interactive Pygame layer.** Level/algorithm menu with train-or-watch-saved-policy choice and intrinsic-reward toggle. Live controls: pause, playback speed, restart episode, quit. Optional sprites fall back to drawn shapes.
- **Analysis scripts.** Q-learning vs SARSA on Level 1, three-algorithm comparison, key-and-chest comparison, monster-level comparison, intrinsic-reward comparison, policy and learning-curve plots.
- **QA.** 46 test functions covering rock blocking, fire death, apple/key/chest rules, episode-end conditions, state encoding for monsters/threats, monster randomness with seeded RNG, epsilon decay, tie-breaking, intrinsic bonus, CSV logging, menu selection, rendering animation, level-config validation. Full two-part suite reported passing with zero skips. Reward constants pinned by tests; death reward is intentionally 0.0 (spec's reward list has no death term). Written rule set from earlier grading feedback (terminal handling, on-policy vs off-policy targets, perception-not-strategy observations, multi-episode evaluation) with a pre-submission self-audit.

### Training results

Source: `logs/task*/` CSVs, single seed (0), mean over the last 10% of episodes while epsilon is still 0.05. Environment-only return logged.

| Level | Task | Algorithm | Mean return | Death rate | Max possible return |
|---|---|---|---|---|---|
| 1 | Fire shortcut | Q-learning | 2.92 | 3% | 3 |
| 1 | Fire shortcut | SARSA | 2.92 | 3% | 3 |
| 2 | Key and chest | Q-learning | 5.00 | 0% | 5 |
| 2 | Key and chest | SARSA | 5.00 | 0% | 5 |
| 3 | Key and chest maze | Q-learning | 6.00 | 0% | 6 |
| 3 | Key and chest maze | SARSA | 4.52 | 22% | 6 |
| 4 | Monsters, open | Q-learning | 2.83 | 12% | 3 |
| 4 | Monsters, open | SARSA | 2.81 | 14% | 3 |
| 5 | Monster corridor | Q-learning | 2.13 | 34% | 3 |
| 5 | Monster corridor | SARSA | 1.65 | 50% | 3 |
| 6 | Intrinsic reward | Without bonus | 2.83 | 12% | 3 |
| 6 | Intrinsic reward | With bonus | 0.04 | 35% | 3 |

### Honest notes

- On Level 1 the two algorithms end almost identical in final return — the expected "SARSA is more conservative near the fire" contrast needs the greedy rollout comparison script, not these numbers.
- On Level 6 the intrinsic bonus did **not** help in the logged run (0.04 vs 2.83). Report as a finding, or re-run before claiming any benefit.
- Results are single-seed; multi-seed runs would be stronger evidence.
- Do not claim anything about Part II as personal work unless **[VERIFY]**.

### Resume bullets

- Developed and tested Part I of a reinforcement learning project: a headless gridworld environment and Q-learning, SARSA and Expected SARSA agents trained across seven levels with hazards, key-and-chest puzzles and stochastic monsters.
- Designed a compact relative-hazard state encoding and a count-based intrinsic reward, and built an interactive Pygame interface for live training and policy replay.
- Wrote a 46-test suite pinning environment rules, update targets and logging, and ran a rule-based self-audit before submission.
- Produced reproducible CSV logs and comparison scripts, and reported mixed results honestly, including a level where the intrinsic bonus underperformed.

### Updated from master file (2026-10-01)

- **Date:** 2026-09. **Status:** "Complete, tests passing."
- **Level map:** 0 = apples, 1 = fire-gap shortcut (Q-learning vs SARSA contrast level), 2–3 = key and chest, 4–5 = stochastic monsters, 6 = intrinsic reward (reuses Level 4's layout).

---

## 5. TicTacToang

**Role: Frontend Specialist** · Date: 2026-05 · Status: Shipped (course project)

> Source: portfolio website only — **no codebase was reviewed** for this project. Treat all figures below as self-reported until checked against the repo.

### Context
RMIT Full Stack Development 2026A, Group 1. Stack: React, Node.js, Socket.IO, MongoDB.
Repo: https://github.com/RMIT-Full-Stack-Development-2026A/Group1.git

### What the portfolio claims
- Built 10+ React modules using an N-Tier architecture, handling concurrent real-time sessions for multiple players.
- Shipped a WebSocket event loop with sub-50ms latency for live gameplay and full match-replay persistence.
- Cut Largest Contentful Paint by 40% through route-level code splitting, lazy loading and asset chunking.

### Honest notes
- A cover-letter draft also claimed "Team Lead" and "50+ concurrent users" — **neither appears in the portfolio text**. **[VERIFY]** before reusing either claim.

### Resume bullets (as self-reported — verify before use)
- Built 10+ React modules on an N-Tier architecture handling concurrent real-time multiplayer sessions.
- Shipped a WebSocket event loop with sub-50ms latency and full match-replay persistence.
- Cut Largest Contentful Paint by 40% via route-level code splitting, lazy loading and asset chunking.

---

## 6. EventX

**Role: Backend Specialist** · Date: 2025-12 · Status: Complete, scored 81/100 (High Distinction)

> Source: portfolio website only — **no codebase was reviewed** for this project.

### Context
RMIT assignment 2, build a backend (SGS TUT02 Group 2). Stack: Java, PostgreSQL, JPA, REST.
Repo: https://github.com/RMIT-Vietnam-Teaching/assignment-2-build-a-backend-sgs-tut02-group2

### What the portfolio claims
- Delivered a full role-based access control system across 4 user roles (admin, organizer, attendee, staff) in 6 weeks.
- Automated batch QR ticket generation and email dispatch, processing 500+ tickets per event.
- Built an analytics dashboard tracking revenue, check-in rate and capacity utilization.

### Honest notes
- An earlier cover-letter draft said the backend used Supabase and the Repository Pattern; the portfolio says PostgreSQL and JPA. **[VERIFY]** which is accurate before reusing either version.

### Resume bullets (as self-reported — verify before use)
- Delivered a role-based access control system across 4 roles (admin, organizer, attendee, staff) in 6 weeks.
- Automated batch QR ticket generation and email dispatch processing 500+ tickets per event.
- Built an analytics dashboard tracking revenue, check-in rate and capacity utilization.

---

## 7. Railway Management System

**Role: Database and Application Developer** · Date: 2025-12 · Status: Complete, scored 80/100 (top in cohort)

> Source: portfolio website only (link is a demo video) — **no codebase was reviewed** for this project.

### Context
University database project. Stack: Oracle APEX, SQL, Java OOP.
Demo: https://youtu.be/UtmZ8a5-d_4?si=gXK74qjdYchXJCiS

### What the portfolio claims
- Designed a relational schema from scratch in Oracle APEX covering schedules, bookings and fleet tracking.
- Implemented a dynamic seat mapper and a real-time latitude/longitude fleet tracker with live booking state.
- Built revenue and trip-performance dashboards with QR ticket integration.

### Resume bullets (as self-reported — verify before use)
- Designed a relational schema in Oracle APEX covering schedules, bookings and fleet tracking.
- Implemented a dynamic seat mapper and real-time fleet tracker with live booking state.
- Built revenue and trip-performance dashboards with QR ticket integration.

---

## 8. FlowGuard

**Role: Led development** · Date: 2025 · Status: Won 1st place, RMIT Hack-A-Venture (100+ teams nationwide)

> Source: awards section of portfolio website only — **no codebase was reviewed** for this project.

### Context
Hackathon project. Stack: Next.js, Python, Supabase.
Repo: https://github.com/KhanhQNguyn/flowguard

### What the portfolio claims
A real-time flood early-warning platform integrating IoT sensors, weather APIs and tidal data. Led development; won first place among 100+ teams nationwide.

### Resume bullets (as self-reported — verify before use)
- Led development of a real-time flood early-warning platform integrating IoT sensors, weather APIs and tidal data.
- Won 1st place at RMIT Hack-A-Venture among 100+ teams nationwide.

---

## 9. Stock Trading RL System (DSTC 2025)

**Role: Developer** **[VERIFY]** exact role · Date: 2025 · Status: Placed 2nd (1st Runner-Up), Data Science Talent Competition

> Source: awards section of portfolio website only — **no codebase was reviewed** for this project.

### Context
Competition project. Stack: Python, PyTorch, Telegram API, FiinQuantX.
Repo: https://github.com/KhanhQNguyn/DSTC2025-Th-

### What the portfolio claims
A stock trading system using A3C and DDPG reinforcement learning agents, trained on FiinQuantX financial data, with a live Telegram alert pipeline. Placed second among competing university teams.

### Resume bullets (as self-reported — verify before use)
- Built a stock trading system using A3C and DDPG reinforcement learning agents trained on FiinQuantX financial data.
- Shipped a live Telegram alert pipeline for trading signals.
- Placed 2nd (1st Runner-Up) at the Data Science Talent Competition 2025.

---

## Skills across projects

- **Product and process:** problem framing, scope control under a deadline, milestone planning, risk management, accessibility-first requirements, writing specs that engineers and AI coding assistants can execute.
- **Frontend:** Flutter and Dart (Provider, routing, guards, theming, local notifications), Next.js and React, TypeScript, Tailwind CSS, shadcn and Radix.
- **Engineering practice:** mock-first development, API contracts and handoff docs, race-condition handling, state-machine design, unit testing.
- **Applied AI:** LLM integration with confidence thresholds, fuzzy-match-first fallbacks, voice interfaces, and tabular reinforcement learning.
- **Tools:** Git, REST APIs and JWT, MongoDB, Pygame, Claude Code workflows.

---

## Verify before publishing

1. **Pathos name.** Repo is named `job_access_assist`, docs say "Product Name TBD" — assumed this is the project called Pathos.
2. **Pathos role.** Files don't show who authored what — confirm the documents above are yours.
3. **Pathos outcome.** Add placement/result if any; repo has none.
4. **Together.** Confirm which screens/features were yours, and whether team name or course should appear.
5. **FinReCruit.** Confirm whether you built Phase 1, Epic 1 and Epic 2, or only some — also confirm the club's wording.
6. **GAIT-ASM3.** Confirm exact title and whether you touched any Part II work; decide whether to include the Level 6 result as is.
7. **Links.** Pathos/Together/FinReCruit/GAIT-ASM3 still have none found in the files.
8. **Together / FinReCruit dates.** Not in the repos — fill in when known.
9. **TicTacToang.** "Team Lead" and "50+ concurrent users" are in a cover-letter draft but not the portfolio text — confirm which is accurate before reuse.
10. **EventX.** Cover-letter draft says Supabase + Repository Pattern; portfolio says PostgreSQL + JPA — confirm which stack is accurate.
11. **Stock Trading RL System.** Confirm exact role (currently just "Developer").
12. **Projects 5–9 generally.** None of these had their codebase reviewed (source: portfolio website text only) — verify the claimed numbers (10+ modules, sub-50ms latency, 40% LCP cut, 500+ tickets, 80-100/80 scores, 100+ teams, 2nd place) against the actual repos/transcripts before using them in a CV.

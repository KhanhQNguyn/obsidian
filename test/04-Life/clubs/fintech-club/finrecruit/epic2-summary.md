---
type: project
date: 2026-09-30
tags: [club, fintech-club, finrecruit, epic-2, backend-handoff]
---

# Epic 2 - Frontend Summary (handoff for backend)

Up: [[finrecruit]] · Plan and open questions: [[finrecruit-epic-2]] · Convention: [[finrecruit-stack-and-conventions]] · Design: [[finrecruit-design-system]]

> [!success] Status
> **Frontend is done** and runs on a mock store. 18 frames / 11 screens are built.
> Not built (out of scope): **frame 19**, the Department Head's own Interview Schedule tab.

> [!info] Switch mock -> real
> Set `NEXT_PUBLIC_USE_MOCK_DATA=false`.

## Where things live

| What | Path |
|---|---|
| Fetch calls | `src/lib/interview-scheduling/http-api.ts` |
| Interface the UI calls | `src/lib/interview-scheduling/api.ts` |
| Types | `src/types/interviewScheduling.ts` |
| Hooks | `src/hooks/use-interview-scheduling.ts` |

---

## 1. Test it (mock mode)

Run `npm run dev`.
- Frames **1-7** need an **Executive Board** login.
- Frames **8-18** need **no login**.
- Reset mock data (browser console): `localStorage.clear()` then reload.

### Executive Board screens

| #   | Frame                      | Path / action                                                        |
| --- | -------------------------- | -------------------------------------------------------------------- |
| 1   | Schedule config            | `/MasterViewDashboard/interview-scheduling`                          |
| 2   | Publish success modal      | Frame 1 -> Add Slots -> **Save & Publish**                           |
| 3   | Interviewer availability   | `/MasterViewDashboard/interview-scheduling/interviewer-availability` |
| 4   | Availability share modal   | Frame 3 -> **Share Link**                                            |
| 5   | Bookings - All Departments | `/MasterViewDashboard/interview-scheduling/candidate-bookings`       |
| 6   | Bookings share modal       | Frame 5 -> **Share Link**                                            |
| 7   | Bookings - one department  | Frame 5 -> click a department pill                                   |

### Public: interviewer availability (`/interview-availability`)

| # | Frame | Path / action |
|---|---|---|
| 8 | Interviewer form - EB | Choose role **Executive Board** |
| 9 | Interviewer success - EB | Frame 8 -> fill name/email, pick slots, Submit |
| 10 | Interviewer form - Head | Choose role **Department Head** |
| 11 | Interviewer success - Head | Frame 10 -> Submit |
| 12 | Interviewer form - Member | Choose role **Member** |
| 13 | Interviewer success - Member | Frame 12 -> Submit |

### Public: candidate booking (`/interview-booking`)

| # | Frame | Path / action |
|---|---|---|
| 14 | Interviewee form | `/interview-booking` |
| 15 | Confirm modal | Frame 14 -> name + email, pick slot, **Confirm Booking** |
| 16 | Booking success | Frame 15 -> **Confirm & Lock** |
| 17 | Slot Unavailable | Two tabs on frame 14: book slot X in tab A, then book X in stale tab B |
| 18 | Already booked | Frame 14 -> email `s9999999@rmit.edu.vn` (tab out of the field) |
| 19 | - | **Not built** |

---

## 2. Endpoints to implement

> [!note] Auth
> **Executive routes:** `withRBAC` Executive Board + `logSystemEvent` (category `interview-scheduling` already exists).
> **Public routes:** no auth (`middleware.ts` already passes `/api/*`).

### Executive

| Method + path | Request | Response |
|---|---|---|
| `GET /api/executive/interview-slots` | - | `{ slots: InterviewSlot[] }` |
| `POST /api/executive/interview-slots` | `{ slots: NewInterviewSlot[] }` | `{ slots }` (created). Server sets generation/semester from the active SystemConfig and ignores client values |
| `PATCH /api/executive/interview-slots/:id` | `{ date?, startTime?, endTime?, room? }` | `{ slots }`. **409** `{ message }` if BOOKED, **404** if missing |
| `DELETE /api/executive/interview-slots/:id` | - | `{ slots }`. **409** `{ message }` if BOOKED. Also delete its availability |
| `GET /api/executive/interview-links` | - | `{ internalUrl, publicUrl }` (-> `/interview-availability`, `/interview-booking`; tokenise if wanted) |
| `GET /api/executive/interview-availability` | - | `{ slots, availability }` |
| `GET /api/executive/interview-bookings?department=all\|<Dept>` | - | `{ slots, availability }` |

### Public

| Method + path | Request | Response |
|---|---|---|
| `GET /api/public/interview-availability` | - | `{ slots }` |
| `POST /api/public/interview-availability` | `SubmitAvailabilityInput` | `{ success: true }` |
| `GET /api/public/interview-booking?department=<Dept>` | - | `{ slots: (InterviewSlot & { bookable })[] }` |
| `GET /api/public/interview-booking?email=<e>` | - | `{ booking: InterviewSlot \| null }` |
| `POST /api/public/interview-booking` | `{ name, email, studentId?, department, slotId }` | **200** `{ booking }` · **409** `{ reason: 'SLOT_NO_LONGER_AVAILABLE' \| 'ALREADY_BOOKED', existingBooking? }` · **404** `{ reason: 'SLOT_NOT_FOUND' }` |

---

## 3. Logic rules

1. **Booking is atomic:** `findOneAndUpdate({_id, status:'AVAILABLE'}, {status:'BOOKED', bookedByCandidateId})`. No match -> `SLOT_NO_LONGER_AVAILABLE`. Check `ALREADY_BOOKED` (candidate already has a BOOKED slot) **first**.
2. **Slot is global:** one booking blocks it for every department.
3. **`bookable`** = `status === 'AVAILABLE'` AND at least one availability record with the same slot + department + `isHead: true`.
4. **Submit availability = replace:** delete all records from this email, insert the new ones. Payload `selections: [{department, slotIds}]`. Head/Member send one department; Executive Board sends all four (store `isHead: false`).
5. **Department names** are full: `'Technology Department' | 'Business Department' | 'HR Department' | 'Marketing Department'`.
6. **Formats in JSON:** dates `'YYYY-MM-DD'`, times `'HH:mm'`.
7. **Booking success should send the `.ics` email** (the UI already says it was sent).

---

## 4. Model gaps (decisions for backend)

> [!warning] Reconcile before wiring real mode
> See the existing schema notes in [[finrecruit-epic-2]].

- **`InterviewerAvailability`:** add `interviewerEmail` and `interviewerRole` (`Executive Board | Department Head | Member`). Mind the `(slotId, department, interviewerName)` unique index: same name with a different email would collide.
- **Slot responses** must include joined candidate fields: `bookedCandidateName`, `bookedCandidateStudentId`, `bookedCandidateEmail`, `bookedDepartment` (from `Candidate`).
- **Candidate lookup:** the form has only name + email. Resolve the `Candidate` by email (derive student ID from it). **Decide:** reject non-Round-1-passers? (The FE has no such state yet.)
- **Booking status** (Completed / No Show) has no field; the UI shows Scheduled / Available only.

---

## 5. Frontend gotchas

> [!bug] Real mode: EB screens will look empty
> `useInterviewSlots()` and `useAvailabilityRecords()` in `src/hooks/use-interview-scheduling.ts` read the **mock store directly**. In real mode the EB screens (**1, 3, 5-7**) will not show server data until those two hooks are switched to `getInterviewSchedulingApi()` fetches (marked `TODO(backend)`).

- Generation/semester in `InterviewSchedulingClient.tsx` is a **seed constant**; the server should override it.

---

## Checklist for backend

- [ ] Executive slot routes (GET / POST / PATCH / DELETE) with 409 on BOOKED
- [ ] Executive links, availability and bookings routes
- [ ] Public availability GET + POST (replace semantics)
- [ ] Public booking GET (by department, by email) + atomic POST with 409 / 404 reasons
- [ ] Extend `InterviewerAvailability` (email, role)
- [ ] Join candidate fields into slot responses
- [ ] `.ics` email on booking success
- [ ] Switch the two EB hooks to real fetches; flip `NEXT_PUBLIC_USE_MOCK_DATA=false`

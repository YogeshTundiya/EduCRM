# Product Requirements Document (PRD)
## Student & Course Management System ("EduTrack")

**Version:** 1.0
**Status:** Draft for review
**Owner:** Product/Admin Team

---

## 1. Purpose & Background

The institute currently manages student enrollment, course scheduling, professor assignment, and attendance manually or across disconnected sheets. This creates three recurring problems: it's hard to see which course a student is in and when it started/ends, there's no single place to see who teaches what, and attendance isn't tied to the course timeline.

EduTrack is an internal admin dashboard that centralizes:
- Course catalog (Technical / Non-Technical), each with a duration in months and a set of modules/topics.
- Professors, and which courses/students they're assigned to.
- Students, their contact info, enrolled course, assigned professor, and auto-calculated course start/end dates.
- Attendance, marked per student per course session with timestamps, scoped to the student's enrollment window.

## 2. Goals

1. Give admin staff one dashboard to manage courses, modules, professors, students, and attendance.
2. Automatically calculate each student's course end date from their course's duration (in months) and their start date — no manual date math.
3. Make it trivial to filter/search students by professor, course, or status.
4. Track attendance with a timestamp, scoped to a student's active course period.
5. Ship a clean, modern, light-themed UI (per the supplied reference design) that is fast to navigate via a collapsible sidebar.

## 3. Non-Goals (Out of Scope for v1)

- Public-facing student self-service portal or login (v1 is admin/staff-only).
- Online payments / fee collection workflows.
- Certificate generation.
- Mobile native apps (responsive web only).
- Multi-institute / multi-tenant support.

## 4. Target Users & Personas

| Persona | Description | Key needs |
|---|---|---|
| **Admin (Institute Owner/Manager)** | Runs the institute, adds courses & professors, oversees everything | Full CRUD access, dashboard overview, reports |
| **Front-desk / Coordinator staff** | Enrolls students day-to-day, marks attendance | Fast student add/edit, easy attendance marking, search & filters |
| **Professor** *(view-only, future phase)* | Teaches one or more courses | See their assigned students & mark attendance (Phase 2) |

For v1, all authenticated users are treated as Admin/Staff with full access. Role separation (Admin vs Staff vs Professor login) is flagged as Phase 2 in section 9.

## 5. User Stories

**Courses & Modules**
- As an admin, I can create a course with a name, type (Technical / Non-Technical), and duration in months, so the system knows how long a student's enrollment runs.
- As an admin, I can add multiple modules/topics to a course (e.g. "HTML, CSS, JavaScript, MongoDB, Node JS, React"), so the syllabus is visible on the course and on every enrolled student's profile.
- As an admin, I can edit or archive a course without deleting historical student records tied to it.

**Professors**
- As an admin, I can add a professor (name, email, phone, specialization/subject) and assign them to one or more courses.
- As an admin, I can see, per professor, the list of students currently assigned to them.

**Students**
- As an admin, I can add a student with name, email, phone, enrolled course, assigned professor, and enrollment/start date.
- The system automatically computes the course end date = start date + course duration (months).
- As an admin, I can open a student's detail page and see: personal info, course + module list, assigned professor, enrollment window (start → end, days remaining / status), and their attendance history.
- As an admin, I can filter/search the student list by professor, by course, by status (Active / Completed / Dropped), and by free-text (name/email/phone).

**Attendance**
- As an admin/coordinator, I can open an attendance page for a specific course and date, and mark each enrolled student Present/Absent/Late with a check-in (and optional check-out) time.
- Attendance can only be marked for students whose enrollment window covers that date (i.e., within their course period).
- As an admin, I can view a student's full attendance log from their detail page.

**Dashboard**
- As an admin, I land on an overview dashboard showing total students, total courses, total professors, active enrollments, and recent activity (new enrollments, today's attendance summary).

## 6. Functional Requirements

### 6.1 Course Management
- Fields: Course Name, Type (`Technical` / `Non-Technical`), Duration (months, integer), Description (optional), Status (`Active` / `Archived`).
- Modules: each course has an ordered list of module/topic entries (free text tags, e.g. one row per skill as shown in the reference sheet — "CSS", "HTML", "JavaScript", "MongoDB", "Node JS", "Personality Development", "Project", "React", "C Lang", "C++").
- Actions: Create, Edit, Archive, Delete (soft-delete preferred so historical student data stays intact).
- Course list view: table/card list with Type badge, Duration, Module count, active student count.

### 6.2 Professor Management
- Fields: Name, Email, Phone, Specialization, Photo (optional), Status (`Active`/`Inactive`).
- Assign professor to one or more courses.
- Professor detail view: assigned courses + list of currently assigned students.

### 6.3 Student Management
- Fields: Name, Email, Phone, Photo (optional), Enrolled Course, Assigned Professor, Enrollment/Start Date, Status.
- **Auto-calculated:** Course End Date = Start Date + Course Duration (months). Recalculates automatically if the course or start date changes.
- Status derived automatically from dates: `Upcoming` (start date in future), `Active` (today within window), `Completed` (past end date) — with manual override to `Dropped`.
- Student list: table with search (name/email/phone) + filters (Professor, Course, Status).
- Student detail page: profile card, course & module list (pulled from the course), professor card, enrollment timeline, attendance history table.

### 6.4 Attendance
- Attendance is captured per (student, course, date) with: status (`Present`/`Absent`/`Late`), check-in time, optional check-out time, marked-by, notes (optional).
- Attendance page workflow: pick course → pick date → see the roster of students enrolled in that course whose window covers that date → mark each.
- Attendance history is visible both on the Attendance page (by date/course) and the Student Detail page (chronological log for that student).

### 6.5 Dashboard / Overview
- Summary cards: Total Students, Total Courses, Total Professors, Active Enrollments, This Month's New Enrollments.
- A simple trend chart (enrollments per month, or attendance rate per week).
- Recent activity feed: latest student additions, latest attendance marked.

### 6.6 Navigation & Shell
- Collapsible left sidebar (icon-only when collapsed, icon+label when expanded) with sections: Overview, Students, Courses, Professors, Attendance, Reports, Settings.
- Top bar: global search, notifications icon, profile menu.
- All list pages support search + filter + pagination.

## 7. UI/UX Requirements

- **Theme:** Light theme only for v1 — white/near-white surfaces, soft shadows, rounded cards, single accent color (see Design Doc for exact tokens), matching the supplied reference dashboard's structure (top stat cards → main content grid → activity table).
- **Typography:** Modern, clean, geometric sans-serif — not a display/fancy face. Clear hierarchy between numbers (stat cards), headings, and body/table text.
- **Iconography:** Consistent icon set (outline style) with subtle micro-animation on interaction (hover/active state transitions, not constant motion).
- **Sidebar:** Collapsible/expandable, persists user preference, active route highlighted.
- **Components needed:** stat cards, data tables with sort/filter, status badges (Active/Completed/Dropped, Present/Absent/Late), modals/drawers for add/edit forms, searchable dropdowns (course/professor pickers), date pickers, tabs (on student/course/professor detail pages).
- **Responsiveness:** Usable down to tablet width; sidebar auto-collapses on small screens.

## 8. Success Metrics

- Time to enroll a new student reduced to under 1 minute.
- 100% of students have an auto-correct start/end date (zero manual date-math errors).
- Attendance marked for at least 90% of active course-days within the tool (adoption metric).
- Admin can find "all students under Professor X" in under 3 clicks.

## 9. Assumptions & Constraints

- Single institute, single timezone for v1.
- One professor can teach multiple courses; a student has exactly one assigned professor at a time (tied to their course).
- Course duration is always expressed in whole months.
- Admin/staff share one login tier in v1; granular roles (Admin vs Coordinator vs Professor self-login) are Phase 2.

## 10. Future Scope (Phase 2+)

- Role-based logins: Professor portal (view own students, self-mark attendance), Student self-service portal.
- Batches/sections within a course (multiple start cohorts running in parallel).
- Fee/payment tracking and invoices.
- Certificate generation on course completion.
- SMS/email notifications (attendance alerts, course-ending reminders).
- Exportable reports (PDF/Excel) for students, attendance, and professor workload.

# Technical Requirements Document (TRD)
## Student & Course Management System ("EduTrack")

**Version:** 1.0
**Companion to:** PRD.md, DESIGN.md

---

## 1. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend framework | **Next.js 14 (App Router, TypeScript)** | File-based routing, server components for fast list pages, deploys cleanly to Vercel |
| Styling | **Tailwind CSS** + small custom component layer | Matches the "modern, clean" light-theme requirement, fast to theme consistently |
| Icons | **lucide-react** | Consistent outline icon set; paired with Framer Motion for micro-interactions |
| Animation | **Framer Motion** | Sidebar collapse, hover/active icon transitions, modal/drawer transitions |
| Client data fetching / cache | **TanStack Query (React Query)** | Handles loading/error/cache state for all list & detail pages |
| Forms & validation (client) | **React Hook Form + Zod** | Type-safe forms, shared Zod schemas with backend |
| Charts | **Recharts** | Dashboard trend chart (enrollments/attendance over time) |
| Backend framework | **Node.js + Express (TypeScript)** | Deliberately **separate** from the Next.js app per requirement; simple REST API |
| ORM | **Prisma** | Type-safe PostgreSQL access, migrations, schema-as-code |
| Database | **PostgreSQL** | Relational data (students↔courses↔professors↔attendance) fits relational model well |
| Auth | **JWT (access + refresh token), bcrypt for password hashing** | Stateless auth between separate frontend/backend |
| Validation (server) | **Zod** (shared schema package or duplicated contract) | Consistent validation rules front & back |
| API docs | **OpenAPI/Swagger** (`swagger-ui-express`) | Self-documenting REST API |
| Testing | **Vitest/Jest** (backend unit + integration), **Playwright** (frontend e2e) | |
| Deployment | Frontend → **Vercel**; Backend → **Render/Railway**; DB → **Neon/Supabase (managed Postgres)** | |
| Logging | **pino** (backend) | Structured JSON logs |

## 2. High-Level Architecture

```
┌─────────────────────┐        HTTPS / REST (JSON)        ┌──────────────────────┐
│   Next.js Frontend   │  ───────────────────────────────▶ │   Express API (BE)   │
│  (App Router, RSC)   │  ◀─────────────────────────────── │   Node.js + TS       │
│  Vercel              │        JWT in Authorization        │   Render/Railway      │
└─────────────────────┘             header                 └───────────┬──────────┘
                                                                          │ Prisma Client
                                                                          ▼
                                                              ┌──────────────────────┐
                                                              │     PostgreSQL        │
                                                              │  (Neon / Supabase)    │
                                                              └──────────────────────┘
```

The frontend never talks to PostgreSQL directly — everything goes through the Express REST API. This keeps frontend and backend fully decoupled (separate repos/folders, separate deploys, separate scaling).

## 3. Repository / Folder Structure

Two independently deployable apps in one monorepo (or two repos — structure is identical either way):

```
edutrack/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   └── login/page.tsx
│   │   │   ├── (dashboard)/
│   │   │   │   ├── layout.tsx              # sidebar + topbar shell
│   │   │   │   ├── page.tsx                # Overview / dashboard
│   │   │   │   ├── students/
│   │   │   │   │   ├── page.tsx            # list + filters
│   │   │   │   │   └── [studentId]/page.tsx
│   │   │   │   ├── courses/
│   │   │   │   │   ├── page.tsx            # list + modules
│   │   │   │   │   └── [courseId]/page.tsx
│   │   │   │   ├── professors/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [professorId]/page.tsx
│   │   │   │   ├── attendance/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── reports/page.tsx
│   │   │   ├── globals.css
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── ui/            # Button, Card, Table, Badge, Modal, Input, Select, DatePicker, Tabs
│   │   │   ├── layout/         # Sidebar, Topbar, CollapsibleNavItem
│   │   │   ├── students/       # StudentTable, StudentForm, StudentFilters, StudentDetailCard
│   │   │   ├── courses/        # CourseCard, ModuleList, CourseForm
│   │   │   ├── professors/     # ProfessorCard, ProfessorForm
│   │   │   ├── attendance/     # AttendanceGrid, AttendanceRow
│   │   │   └── dashboard/      # StatCard, TrendChart, ActivityFeed
│   │   ├── lib/
│   │   │   ├── api/            # typed fetch wrappers per resource (students.ts, courses.ts, ...)
│   │   │   ├── validators/     # Zod schemas (shared shape with backend)
│   │   │   └── utils/          # date math (start+duration→end), formatters
│   │   ├── hooks/               # useStudents, useCourses, useAttendance (React Query hooks)
│   │   ├── store/                # Zustand: sidebar collapsed state, filter state
│   │   └── types/                # shared TS types (Student, Course, Professor, Attendance)
│   ├── public/
│   ├── tailwind.config.ts
│   ├── next.config.js
│   ├── .env.local.example
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/               # env.ts, db.ts (Prisma client singleton)
│   │   ├── modules/
│   │   │   ├── auth/              # controller, service, routes, schema
│   │   │   ├── professors/
│   │   │   ├── courses/           # includes nested module (topic) endpoints
│   │   │   ├── students/
│   │   │   └── attendance/
│   │   │       each module: `*.controller.ts`, `*.service.ts`, `*.routes.ts`, `*.schema.ts`
│   │   ├── middlewares/           # auth.middleware.ts, error.middleware.ts, validate.middleware.ts
│   │   ├── utils/                 # date.util.ts (addMonths), pagination.util.ts, logger.ts
│   │   ├── app.ts                 # express app, middleware wiring
│   │   └── server.ts              # entrypoint
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## 4. Data Model (PostgreSQL via Prisma)

```prisma
enum CourseType {
  TECHNICAL
  NON_TECHNICAL
}

enum EnrollmentStatus {
  UPCOMING
  ACTIVE
  COMPLETED
  DROPPED
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
}

model Admin {
  id           String   @id @default(cuid())
  name         String
  email        String   @unique
  passwordHash String
  role         String   @default("ADMIN")
  createdAt    DateTime @default(now())
}

model Professor {
  id             String    @id @default(cuid())
  name           String
  email          String    @unique
  phone          String?
  specialization String?
  photoUrl       String?
  status         String    @default("ACTIVE")
  courses        CourseProfessor[]
  students       Student[]
  createdAt      DateTime  @default(now())
}

model Course {
  id             String    @id @default(cuid())
  name           String
  type           CourseType
  durationMonths Int
  description    String?
  status         String    @default("ACTIVE")
  modules        Module[]
  professors     CourseProfessor[]
  students       Student[]
  createdAt      DateTime  @default(now())
}

model CourseProfessor {                    // many-to-many join
  courseId    String
  professorId String
  course      Course    @relation(fields: [courseId], references: [id])
  professor   Professor @relation(fields: [professorId], references: [id])
  @@id([courseId, professorId])
}

model Module {
  id        String   @id @default(cuid())
  courseId  String
  name       String    // e.g. "React", "Cyber Security", "Ethical Hacking"
  order      Int       @default(0)
  course     Course    @relation(fields: [courseId], references: [id])
}

model Student {
  id              String            @id @default(cuid())
  name            String
  email           String            @unique
  phone           String?
  photoUrl        String?
  courseId        String
  professorId     String?
  startDate       DateTime
  endDate         DateTime          // computed at write-time: startDate + course.durationMonths
  status          EnrollmentStatus  @default(UPCOMING)
  course          Course            @relation(fields: [courseId], references: [id])
  professor       Professor?        @relation(fields: [professorId], references: [id])
  attendance      Attendance[]
  createdAt       DateTime          @default(now())

  @@index([courseId])
  @@index([professorId])
  @@index([status])
}

model Attendance {
  id          String            @id @default(cuid())
  studentId   String
  courseId    String
  date        DateTime          @db.Date
  status      AttendanceStatus
  checkInAt   DateTime?
  checkOutAt  DateTime?
  markedBy    String?
  notes       String?
  student     Student           @relation(fields: [studentId], references: [id])
  createdAt   DateTime          @default(now())

  @@unique([studentId, date])
  @@index([courseId, date])
}
```

**End-date rule:** `endDate = addMonths(startDate, course.durationMonths)`, recalculated in the service layer whenever a student's `courseId` or `startDate` changes. `status` is derived by a scheduled job / on-read comparison against `today` (`UPCOMING` → `ACTIVE` → `COMPLETED`), unless manually set to `DROPPED`.

## 5. API Design (REST, JSON, versioned under `/api/v1`)

Auth: `Authorization: Bearer <JWT>` on all routes except `/auth/login`.

| Resource | Method & Path | Notes |
|---|---|---|
| Auth | `POST /auth/login` | returns access + refresh token |
| Auth | `POST /auth/refresh` | |
| Auth | `GET /auth/me` | |
| Professors | `GET /professors` `POST /professors` | list supports `?search=` |
| Professors | `GET/PUT/DELETE /professors/:id` | |
| Courses | `GET /courses` `POST /courses` | list supports `?type=&status=` |
| Courses | `GET/PUT/DELETE /courses/:id` | includes nested `modules[]` |
| Modules | `POST /courses/:id/modules` `PUT/DELETE /modules/:id` | |
| Students | `GET /students` `POST /students` | filters: `?professorId=&courseId=&status=&search=&page=&pageSize=` |
| Students | `GET/PUT/DELETE /students/:id` | detail includes course, modules, professor, attendance summary |
| Attendance | `GET /attendance?courseId=&date=` | roster for a course/date, scoped to students whose window covers the date |
| Attendance | `POST /attendance` `PUT /attendance/:id` | mark/update one record |
| Attendance | `GET /students/:id/attendance` | full history for a student |
| Dashboard | `GET /dashboard/stats` | counts + trend series for the Overview page |

All list endpoints return `{ data: [...], meta: { total, page, pageSize } }`. All mutation endpoints validate the request body against a Zod schema and return `400` with field-level errors on failure.

## 6. Security

- Passwords hashed with **bcrypt** (cost factor 12).
- JWT access token (short-lived, ~15 min) + refresh token (httpOnly cookie, ~7 days).
- CORS locked to the deployed frontend origin.
- Rate limiting on `/auth/login` (e.g. `express-rate-limit`).
- Input validation on every mutating endpoint (Zod) — never trust client-computed `endDate`; server recomputes it.
- Parameterized queries only (Prisma handles this by default — no raw SQL string interpolation).

## 7. Non-Functional Requirements

- **Performance:** list endpoints paginated (default 20/page); indexed on `courseId`, `professorId`, `status`, `(courseId, date)` for attendance.
- **Availability:** stateless API (JWT, no server sessions) so it can horizontally scale behind a load balancer if needed.
- **Observability:** structured request logs (method, path, status, latency); error tracking hook (e.g. Sentry) ready for both apps.
- **Environments:** `.env` per app — `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CORS_ORIGIN` (backend); `NEXT_PUBLIC_API_URL` (frontend).

## 8. CI/CD

- GitHub Actions: on PR — lint + typecheck + unit tests for both `frontend/` and `backend/` (path-filtered so each pipeline only runs when its folder changes).
- On merge to `main`: Vercel auto-deploys `frontend/`; a Render/Railway deploy hook redeploys `backend/`; Prisma migrations run as a release step (`prisma migrate deploy`).

## 9. Testing Strategy

- **Backend:** unit tests per service (date math, status derivation), integration tests per route with a test Postgres schema.
- **Frontend:** component tests for forms/tables (React Testing Library), Playwright e2e for the core flows: add course → add professor → add student → mark attendance → verify on student detail page.

# Technoglobe PRO — Backend REST API

Production-ready backend API built with **Node.js, Express, TypeScript, and Prisma**, matching all architectural, data model, and security specifications in `doc/TRD.md`.

---

## Features Implemented

- **Automatic End-Date Computation**:
  - `endDate = addMonths(startDate, course.durationMonths)` auto-calculated in `students.service.ts` whenever a student is enrolled or their course/start date is modified.
  - Lifecycle `status` auto-derived (`UPCOMING` → `ACTIVE` → `COMPLETED`) based on date math against today.
- **Attendance Roster Scoping**:
  - Automatically queries students whose course window (`startDate <= date <= endDate`) covers the requested session date.
  - Enforces date window validation on attendance submissions.
- **Relational Data Model (Prisma)**:
  - `Admin` (Auth credentials with bcrypt hash)
  - `Course` (Technical / Non-Technical, duration in months, modules relation)
  - `Module` (Topic syllabus entries)
  - `Professor` (Specialization, assigned courses join table)
  - `Student` (Course and professor relations, attendance history)
  - `Attendance` (Unique on `[studentId, date]`, checkIn/checkOut timestamps)
- **REST Endpoints (`/api/v1`)**:
  - `POST /api/v1/auth/login` & `GET /api/v1/auth/me`
  - `GET/POST /api/v1/courses` & `GET/PUT/DELETE /api/v1/courses/:id`
  - `POST /api/v1/courses/:id/modules` & `DELETE /api/v1/courses/modules/:id`
  - `GET/POST /api/v1/professors` & `GET/PUT/DELETE /api/v1/professors/:id`
  - `GET/POST /api/v1/students` & `GET/PUT/DELETE /api/v1/students/:id`
  - `GET/POST /api/v1/attendance` (with `?courseId=&date=` query filter)
  - `GET /api/v1/dashboard/stats` (KPIs in Indian Rupees ₹ and monthly trend charts)

---

## Quick Start (How to Run)

Open your terminal in `c:\Users\admin\Documents\yogi1\studtg\backend`:

```powershell
# 1. Install dependencies
npm install

# 2. Push database schema (creates dev.db and generates Prisma Client)
npx prisma db push

# 3. Seed initial Technoglobe data (Admin, Courses, Professors, Students)
npx ts-node src/prisma/seed.ts

# 4. Start the development server
npm run dev
```

The server will be running at: **`http://localhost:5000`**

### Seeded Credentials:
- **Admin Email**: `admin@technoglobe.com`
- **Password**: `admin123`

---

## Switching to PostgreSQL for Production

To deploy to PostgreSQL (e.g. Neon, Supabase, Railway) as specified in `doc/TRD.md`:
1. In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`.
2. In `.env`, set `DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"`.
3. Run `npx prisma db push`.

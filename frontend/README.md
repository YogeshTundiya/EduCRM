# EduTrack — Modern + Minimal Student & Course Management System

A high-performance, modern and minimal UI built matching the reference dashboard aesthetic (Finexy) and fulfilling all technical specifications of the **PRD** and **TRD**.

## Tech Stack
- **Framework**: React 18 with Vite & TypeScript
- **Styling**: Tailwind CSS with custom Finexy design tokens (coral `#FF5B26`, deep obsidian `#141619`, soft surfaces `#F4F5F8`)
- **Typography**: Google Fonts *Plus Jakarta Sans*
- **Animation & Motion**: Framer Motion (layout springs, pill sliders, floating docks) & GSAP (numeric counter tweens)
- **Charts**: Recharts (diagonal hatched Profit & Loss bar chart, enrollment line charts, donut charts)
- **Icons**: Lucide React outline icons with micro-interactions

---

## Getting Started

In your terminal:

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start the local development server
npm run dev
```

Open your browser at [http://localhost:5173](http://localhost:5173).

---

## Implemented Features

1. **Dashboard Overview (Visual Twin of Reference Image)**
   - **Floating Left Dock**: Theme toggle (Sun/Moon), active pill indicator, and quick action icons.
   - **Top Pill Navbar**: Brand logo, sliding pill tab navigation, global search modal (`Ctrl+K`), notifications, and user profile pill.
   - **Total Balance & Wallets Card**: Large balance display, Transfer modal, Request/Enroll action, multi-currency wallet capsules (USD, EUR, GBP), monthly spending limit progress bar, and interactive sleek obsidian/orange credit cards.
   - **2x2 Bento Metric Cards**: Total Earnings (vibrant coral card), Total Spending, Total Income, Total Revenue with GSAP animated count-up numbers.
   - **Recharts Bar Chart**: Dual-tone Profit and Loss chart from Jan to Aug with custom diagonal stripe textures and tooltips.
   - **Recent Activities Table**: Full-featured interactive table with search, status filters (Completed, Pending, In Progress), checkable rows, and branded icons.

2. **Student Management (`/students`)**
   - Roster table with multi-criteria filtering by Course, Professor, and Status (`Active`, `Upcoming`, `Completed`, `Dropped`).
   - **Enroll Student Modal**: Automatic real-time end date calculation (`startDate + course.durationMonths`) without manual date math.
   - **Student Profile Drawer**: Complete student profile, syllabus module checklist, assigned professor card, and historical attendance log.

3. **Courses & Modules (`/courses`)**
   - Course catalog classified into **Technical** and **Non-Technical**.
   - Modular syllabus tags (e.g., HTML, CSS, JavaScript, React, Node JS, MongoDB).
   - "Create New Course" modal with duration in months and topic tagging.

4. **Faculty & Mentorship (`/professors`)**
   - Faculty cards with specialization, contact details, assigned courses, and active mentee student counts.
   - "Add Professor" modal.

5. **Daily Attendance Matrix (`/attendance`)**
   - Course picker and Date picker.
   - Automatically filters roster to students whose enrollment window covers the selected date.
   - 1-click status marking (`Present`, `Late`, `Absent`) with automatic check-in timestamp.
   - Real-time session KPI summary.

6. **Analytics & Reports (`/reports`)**
   - Recharts visual reports showing monthly cohort expansion, attendance consistency trends, and course distribution.

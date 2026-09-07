export type CourseType = 'TECHNICAL' | 'NON_TECHNICAL';

export type EnrollmentStatus = 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'DROPPED';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE';

export interface Course {
  id: string;
  name: string;
  type: CourseType;
  durationMonths: number;
  description: string;
  status: 'ACTIVE' | 'ARCHIVED';
  modules: string[]; // e.g. ["HTML", "CSS", "JavaScript", "MongoDB", "Node JS", "React"]
  activeStudentCount?: number;
}

export interface Professor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  photoUrl: string;
  status: 'ACTIVE' | 'INACTIVE';
  assignedCourses: string[]; // Course IDs
  activeStudentCount?: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  photoUrl: string;
  courseId: string;
  courseName?: string;
  professorId: string;
  professorName?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD (calculated: startDate + durationMonths)
  status: EnrollmentStatus;
  attendanceRate?: number;
  totalDays?: number;
  daysRemaining?: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName?: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  checkInAt?: string;
  checkOutAt?: string;
  markedBy?: string;
  notes?: string;
}

export interface ActivityItem {
  id: string; // e.g. "INV_000076"
  activity: string; // e.g. "Mobile App Purchase" or "Web Development Masterclass"
  icon: 'app' | 'hotel' | 'flight' | 'grocery' | 'adobe' | 'code' | 'shield';
  price: string; // e.g. "$25,500"
  status: 'Completed' | 'Pending' | 'In Progress';
  date: string; // e.g. "17 Apr, 2026 03:45 PM"
  studentId?: string;
}

export interface WalletItem {
  id: string;
  currency: string;
  code: string;
  flag: string;
  amount: string;
  limit: string;
  status: 'Active' | 'Inactive';
}

export interface CreditCardItem {
  id: string;
  cardNumber: string; // "**** **** 6782"
  exp: string; // "09/29"
  cvv: string; // "611"
  theme: 'black' | 'orange';
  active: boolean;
  type: 'mastercard' | 'visa';
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'STAFF' | string;
  avatarUrl?: string;
}

export interface TrashedStudent extends Student {
  deletedAt: string;
}

export interface TrashedCourse extends Course {
  deletedAt: string;
}

export interface InstituteSettings {
  instituteName: string;
  tagline: string;
  contactEmail: string;
  phone: string;
  currencySymbol: string;
  defaultDurationMonths: number;
  minAttendanceThreshold: number;
  timezone: string;
  isCustomCursorEnabled: boolean;
}



import { Course, Professor, Student, AttendanceRecord, ActivityItem, WalletItem, CreditCardItem } from '../types';
import { calculateEndDate } from '../utils/dateMath';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    name: 'Full Stack Web Development',
    type: 'TECHNICAL',
    durationMonths: 6,
    description: 'Comprehensive program covering modern frontend, backend systems, database architecture and production deployment.',
    status: 'ACTIVE',
    modules: ['HTML', 'CSS', 'JavaScript', 'MongoDB', 'Node JS', 'React', 'Project'],
    activeStudentCount: 42
  },
  {
    id: 'course-2',
    name: 'Cyber Security & Ethical Hacking',
    type: 'TECHNICAL',
    durationMonths: 4,
    description: 'Practical security methodologies, penetration testing, network defenses, and threat analysis.',
    status: 'ACTIVE',
    modules: ['Linux Fundamentals', 'Networking & Protocols', 'Ethical Hacking', 'Penetration Testing', 'Incident Response'],
    activeStudentCount: 28
  },
  {
    id: 'course-3',
    name: 'Cloud & DevOps Architecture',
    type: 'TECHNICAL',
    durationMonths: 5,
    description: 'Master containerization, CI/CD pipelines, automated infrastructure and Kubernetes clusters.',
    status: 'ACTIVE',
    modules: ['Linux & Bash', 'Docker Containers', 'Kubernetes Clusters', 'AWS Cloud Services', 'CI/CD Pipelines'],
    activeStudentCount: 35
  },
  {
    id: 'course-4',
    name: 'UI/UX Design Systems & Motion',
    type: 'NON_TECHNICAL',
    durationMonths: 4,
    description: 'End-to-end design theory, micro-interactions, Figma component architecture and design tokens.',
    status: 'ACTIVE',
    modules: ['Design Foundations', 'Figma Prototyping', 'Design Systems', 'Motion & Micro-interactions', 'Design Handoff'],
    activeStudentCount: 24
  },
  {
    id: 'course-5',
    name: 'Product Leadership & Strategy',
    type: 'NON_TECHNICAL',
    durationMonths: 3,
    description: 'Agile discovery, quantitative user analytics, roadmapping and growth framework execution.',
    status: 'ACTIVE',
    modules: ['Product Discovery', 'User Research', 'Agile & Scrum', 'Roadmapping', 'Growth Metrics'],
    activeStudentCount: 19
  }
];

export const INITIAL_PROFESSORS: Professor[] = [
  {
    id: 'prof-1',
    name: 'Dr. Aris Thorne',
    email: 'aris.thorne@technoglobe.edu',
    phone: '+91 98290 12345',
    specialization: 'Distributed Systems & Web Tech',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    assignedCourses: ['course-1', 'course-3'],
    activeStudentCount: 48
  },
  {
    id: 'prof-2',
    name: 'Prof. Elena Rostova',
    email: 'elena.rostova@technoglobe.edu',
    phone: '+91 98290 23456',
    specialization: 'Cyber Security & Cryptography',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    assignedCourses: ['course-2'],
    activeStudentCount: 28
  },
  {
    id: 'prof-3',
    name: 'Marcus Vance',
    email: 'marcus.vance@technoglobe.edu',
    phone: '+91 98290 34567',
    specialization: 'Cloud Infrastructure & SRE',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    assignedCourses: ['course-3'],
    activeStudentCount: 35
  },
  {
    id: 'prof-4',
    name: 'Priya Sharma',
    email: 'priya.sharma@technoglobe.edu',
    phone: '+91 98290 45678',
    specialization: 'Human-Computer Interaction & UI',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    assignedCourses: ['course-4', 'course-5'],
    activeStudentCount: 43
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stud-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    phone: '+1 (555) 111-2233',
    photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    courseId: 'course-1',
    courseName: 'Full Stack Web Development',
    professorId: 'prof-1',
    professorName: 'Dr. Aris Thorne',
    startDate: '2026-01-15',
    endDate: calculateEndDate('2026-01-15', 12),
    status: 'ACTIVE',
    attendanceRate: 96,
    daysRemaining: 180
  },
  {
    id: 'stud-2',
    name: 'Sophia Chen',
    email: 'sophia.chen@example.com',
    phone: '+1 (555) 222-3344',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    courseId: 'course-2',
    courseName: 'Cyber Security & Ethical Hacking',
    professorId: 'prof-2',
    professorName: 'Prof. Elena Rostova',
    startDate: '2026-02-01',
    endDate: calculateEndDate('2026-02-01', 10),
    status: 'ACTIVE',
    attendanceRate: 92,
    daysRemaining: 120
  },
  {
    id: 'stud-3',
    name: 'Liam Gallagher',
    email: 'liam.g@example.com',
    phone: '+1 (555) 333-4455',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    courseId: 'course-3',
    courseName: 'Cloud & DevOps Architecture',
    professorId: 'prof-3',
    professorName: 'Marcus Vance',
    startDate: '2026-03-01',
    endDate: calculateEndDate('2026-03-01', 10),
    status: 'ACTIVE',
    attendanceRate: 88,
    daysRemaining: 150
  },
  {
    id: 'stud-4',
    name: 'Zoe Martinez',
    email: 'zoe.m@example.com',
    phone: '+1 (555) 444-5566',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    courseId: 'course-4',
    courseName: 'UI/UX Design Systems & Motion',
    professorId: 'prof-4',
    professorName: 'Priya Sharma',
    startDate: '2026-02-15',
    endDate: calculateEndDate('2026-02-15', 10),
    status: 'ACTIVE',
    attendanceRate: 98,
    daysRemaining: 110
  },
  {
    id: 'stud-5',
    name: 'David Kim',
    email: 'david.kim@example.com',
    phone: '+1 (555) 555-6677',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    courseId: 'course-1',
    courseName: 'Full Stack Web Development',
    professorId: 'prof-1',
    professorName: 'Dr. Aris Thorne',
    startDate: '2026-03-15',
    endDate: calculateEndDate('2026-03-15', 9),
    status: 'ACTIVE',
    attendanceRate: 91,
    daysRemaining: 160
  },
  {
    id: 'stud-6',
    name: 'Amara Okafor',
    email: 'amara.o@example.com',
    phone: '+1 (555) 666-7788',
    photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    courseId: 'course-5',
    courseName: 'Product Leadership & Strategy',
    professorId: 'prof-4',
    professorName: 'Priya Sharma',
    startDate: '2026-01-10',
    endDate: calculateEndDate('2026-01-10', 12),
    status: 'ACTIVE',
    attendanceRate: 94,
    daysRemaining: 140
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-1',
    studentId: 'stud-1',
    studentName: 'Alex Rivera',
    courseId: 'course-1',
    courseName: 'Full Stack Web Development',
    date: '2026-09-02',
    status: 'PRESENT',
    checkInAt: '09:02 AM',
    checkOutAt: '04:58 PM',
    markedBy: 'Admin'
  },
  {
    id: 'att-2',
    studentId: 'stud-2',
    studentName: 'Sophia Chen',
    courseId: 'course-2',
    courseName: 'Cyber Security & Ethical Hacking',
    date: '2026-09-02',
    status: 'PRESENT',
    checkInAt: '09:14 AM',
    checkOutAt: '05:00 PM',
    markedBy: 'Admin'
  },
  {
    id: 'att-3',
    studentId: 'stud-3',
    studentName: 'Liam Gallagher',
    courseId: 'course-3',
    courseName: 'Cloud & DevOps Architecture',
    date: '2026-09-02',
    status: 'LATE',
    checkInAt: '09:42 AM',
    checkOutAt: '05:15 PM',
    markedBy: 'Admin',
    notes: 'Commute delay'
  }
];

// Reference Image Exact Activities Data
export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'INV_000076',
    activity: 'Mobile App Purchase',
    icon: 'app',
    price: '₹25,500',
    status: 'Completed',
    date: '17 Apr, 2026 03:45 PM'
  },
  {
    id: 'INV_000075',
    activity: 'Hotel Booking',
    icon: 'hotel',
    price: '₹32,750',
    status: 'Pending',
    date: '15 Apr, 2026 11:30 AM'
  },
  {
    id: 'INV_000074',
    activity: 'Flight Ticket Booking',
    icon: 'flight',
    price: '₹40,200',
    status: 'Completed',
    date: '15 Apr, 2026 12:00 PM'
  },
  {
    id: 'INV_000073',
    activity: 'Grocery Purchase',
    icon: 'grocery',
    price: '₹50,200',
    status: 'In Progress',
    date: '14 Apr, 2026 09:15 PM'
  },
  {
    id: 'INV_000073',
    activity: 'Software License',
    icon: 'adobe',
    price: '₹15,900',
    status: 'Completed',
    date: '10 Apr, 2026 06:00 AM'
  }
];

// Reference Image Wallets
export const INITIAL_WALLETS: WalletItem[] = [
  {
    id: 'w-1',
    currency: 'INR',
    code: 'INR',
    flag: '🇮🇳',
    amount: '₹2,26,780.00',
    limit: 'Limit is ₹1L a month',
    status: 'Active'
  },
  {
    id: 'w-2',
    currency: 'USD',
    code: 'USD',
    flag: '🇺🇸',
    amount: '₹1,83,450.00',
    limit: 'Limit is ₹80k a month',
    status: 'Active'
  },
  {
    id: 'w-3',
    currency: 'EUR',
    code: 'EUR',
    flag: '🇪🇺',
    amount: '₹1,50,000.00',
    limit: 'Limit is ₹75k a month',
    status: 'Inactive'
  }
];

// Reference Image Cards
export const INITIAL_CARDS: CreditCardItem[] = [
  {
    id: 'card-1',
    cardNumber: '**** **** 6782',
    exp: '09/29',
    cvv: '611',
    theme: 'black',
    active: true,
    type: 'mastercard'
  },
  {
    id: 'card-2',
    cardNumber: '**** **** 4356',
    exp: '11/30',
    cvv: '942',
    theme: 'orange',
    active: true,
    type: 'mastercard'
  }
];

// Bar Chart data matching the Profit and Loss bar visual in reference image (Jan - Aug)
export const CHART_DATA = [
  { month: 'Jan', profit: 38, loss: 19, total: 57 },
  { month: 'Feb', profit: 41, loss: 15, total: 56 },
  { month: 'Mar', profit: 34, loss: 18, total: 52 },
  { month: 'Apr', profit: 43, loss: 24, total: 67 },
  { month: 'May', profit: 38, loss: 16, total: 54 },
  { month: 'Jun', profit: 50, loss: 33, total: 83 },
  { month: 'Jul', profit: 41, loss: 21, total: 62 },
  { month: 'Aug', profit: 36, loss: 16, total: 52 }
];

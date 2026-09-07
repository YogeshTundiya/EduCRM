import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Course,
  Professor,
  Student,
  AttendanceRecord,
  ActivityItem,
  WalletItem,
  CreditCardItem,
  TrashedStudent,
  TrashedCourse,
  InstituteSettings
} from '../types';
import {
  INITIAL_COURSES,
  INITIAL_PROFESSORS,
  INITIAL_STUDENTS,
  INITIAL_ATTENDANCE,
  INITIAL_ACTIVITIES,
  INITIAL_WALLETS,
  INITIAL_CARDS
} from '../data/mockData';
import { calculateEndDate, deriveStatusFromDates } from '../utils/dateMath';

export type NavTab =
  | 'Overview'
  | 'Students'
  | 'Courses'
  | 'Professors'
  | 'Attendance'
  | 'Reports'
  | 'Trash'
  | 'Settings';

const DEFAULT_SETTINGS: InstituteSettings = {
  instituteName: 'EduCRM Institute',
  tagline: 'Enterprise Student & Course Management System',
  contactEmail: 'admin@educrm.com',
  phone: '+91 98290 12345',
  currencySymbol: '₹',
  defaultDurationMonths: 6,
  minAttendanceThreshold: 75,
  timezone: 'Asia/Kolkata (IST)',
  isCustomCursorEnabled: true
};

interface AppContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  courses: Course[];
  professors: Professor[];
  students: Student[];
  attendance: AttendanceRecord[];
  activities: ActivityItem[];
  wallets: WalletItem[];
  cards: CreditCardItem[];
  trashedStudents: TrashedStudent[];
  trashedCourses: TrashedCourse[];
  settings: InstituteSettings;
  updateSettings: (updates: Partial<InstituteSettings>) => void;
  isCustomCursorEnabled: boolean;
  toggleCustomCursor: () => void;
  addStudent: (studentData: {
    name: string;
    email: string;
    phone: string;
    courseId: string;
    professorId: string;
    startDate: string;
    photoUrl?: string;
  }) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  restoreStudent: (id: string) => void;
  permanentlyDeleteStudent: (id: string) => void;
  addCourse: (courseData: {
    name: string;
    type: 'TECHNICAL' | 'NON_TECHNICAL';
    durationMonths: number;
    description: string;
    modules: string[];
  }) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  restoreCourse: (id: string) => void;
  permanentlyDeleteCourse: (id: string) => void;
  emptyTrash: () => void;
  addProfessor: (profData: {
    name: string;
    email: string;
    phone: string;
    specialization: string;
    assignedCourses: string[];
    photoUrl?: string;
  }) => void;
  markAttendance: (
    studentId: string,
    courseId: string,
    date: string,
    status: 'PRESENT' | 'ABSENT' | 'LATE',
    notes?: string
  ) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('Overview');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('edutrack_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [professors, setProfessors] = useState<Professor[]>(() => {
    const saved = localStorage.getItem('edutrack_professors');
    return saved ? JSON.parse(saved) : INITIAL_PROFESSORS;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('edutrack_students_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // Fallback to initial
      }
    }
    localStorage.setItem('edutrack_students_v2', JSON.stringify(INITIAL_STUDENTS));
    return INITIAL_STUDENTS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('edutrack_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem('edutrack_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [wallets] = useState<WalletItem[]>(INITIAL_WALLETS);
  const [cards] = useState<CreditCardItem[]>(INITIAL_CARDS);

  // Trash State
  const [trashedStudents, setTrashedStudents] = useState<TrashedStudent[]>(() => {
    const saved = localStorage.getItem('edutrack_trash_students');
    return saved ? JSON.parse(saved) : [];
  });

  const [trashedCourses, setTrashedCourses] = useState<TrashedCourse[]>(() => {
    const saved = localStorage.getItem('edutrack_trash_courses');
    return saved ? JSON.parse(saved) : [];
  });

  // Settings State
  const [settings, setSettings] = useState<InstituteSettings>(() => {
    const saved = localStorage.getItem('edutrack_institute_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [isCustomCursorEnabled, setIsCustomCursorEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('edutrack_custom_cursor');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // LocalStorage Persistence
  useEffect(() => {
    localStorage.setItem('edutrack_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('edutrack_professors', JSON.stringify(professors));
  }, [professors]);

  useEffect(() => {
    localStorage.setItem('edutrack_students_v2', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('edutrack_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('edutrack_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('edutrack_trash_students', JSON.stringify(trashedStudents));
  }, [trashedStudents]);

  useEffect(() => {
    localStorage.setItem('edutrack_trash_courses', JSON.stringify(trashedCourses));
  }, [trashedCourses]);

  useEffect(() => {
    localStorage.setItem('edutrack_institute_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('edutrack_custom_cursor', JSON.stringify(isCustomCursorEnabled));
  }, [isCustomCursorEnabled]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  const toggleCustomCursor = () => {
    setIsCustomCursorEnabled(prev => !prev);
    showToast(!isCustomCursorEnabled ? 'Custom cursor enabled' : 'Custom cursor disabled');
  };

  const updateSettings = (updates: Partial<InstituteSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    showToast('Settings saved successfully');
  };

  // Student Operations
  const addStudent = (studentData: {
    name: string;
    email: string;
    phone: string;
    courseId: string;
    professorId: string;
    startDate: string;
    photoUrl?: string;
  }) => {
    const course = courses.find(c => c.id === studentData.courseId);
    const professor = professors.find(p => p.id === studentData.professorId);
    const duration = course ? course.durationMonths : 3;
    const endDate = calculateEndDate(studentData.startDate, duration);
    const status = deriveStatusFromDates(studentData.startDate, endDate);

    const newStudent: Student = {
      id: `stud-${Date.now()}`,
      name: studentData.name,
      email: studentData.email,
      phone: studentData.phone,
      photoUrl:
        studentData.photoUrl ||
        `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      courseId: studentData.courseId,
      courseName: course?.name || 'General Course',
      professorId: studentData.professorId,
      professorName: professor?.name || 'Assigned Faculty',
      startDate: studentData.startDate,
      endDate: endDate,
      status: status,
      attendanceRate: 100,
      daysRemaining: Math.max(
        0,
        Math.floor((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      )
    };

    setStudents(prev => [newStudent, ...prev]);

    const newActivity: ActivityItem = {
      id: `INV_${Math.floor(100000 + Math.random() * 900000)}`,
      activity: `Enrolled in ${course?.name || 'Course'}`,
      icon: 'code',
      price: `${settings.currencySymbol}12,500`,
      status: 'Completed',
      date: 'Just now'
    };
    setActivities(prev => [newActivity, ...prev]);
    showToast(`Enrolled ${studentData.name}`);
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id !== id) return s;
        const updated = { ...s, ...updates };
        if (updates.startDate || updates.courseId) {
          const course = courses.find(c => c.id === updated.courseId);
          const duration = course ? course.durationMonths : 3;
          updated.endDate = calculateEndDate(updated.startDate, duration);
          updated.status = deriveStatusFromDates(updated.startDate, updated.endDate);
        }
        return updated;
      })
    );
    showToast('Student details updated');
  };

  const deleteStudent = (id: string) => {
    const studentToDelete = students.find(s => s.id === id);
    if (!studentToDelete) return;

    // Move to Trash
    const trashedItem: TrashedStudent = {
      ...studentToDelete,
      deletedAt: new Date().toISOString()
    };

    setStudents(prev => prev.filter(s => s.id !== id));
    setTrashedStudents(prev => [trashedItem, ...prev]);
    showToast(`${studentToDelete.name} moved to Trash`);
  };

  const restoreStudent = (id: string) => {
    const item = trashedStudents.find(s => s.id === id);
    if (!item) return;

    const { deletedAt, ...restoredStudent } = item;
    setTrashedStudents(prev => prev.filter(s => s.id !== id));
    setStudents(prev => [restoredStudent, ...prev]);
    showToast(`${restoredStudent.name} restored to active students`);
  };

  const permanentlyDeleteStudent = (id: string) => {
    setTrashedStudents(prev => prev.filter(s => s.id !== id));
    showToast('Student permanently deleted');
  };

  // Course Operations
  const addCourse = (courseData: {
    name: string;
    type: 'TECHNICAL' | 'NON_TECHNICAL';
    durationMonths: number;
    description: string;
    modules: string[];
  }) => {
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      name: courseData.name,
      type: courseData.type,
      durationMonths: courseData.durationMonths,
      description: courseData.description,
      status: 'ACTIVE',
      modules: courseData.modules,
      activeStudentCount: 0
    };
    setCourses(prev => [...prev, newCourse]);
    showToast(`Course "${courseData.name}" created`);
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        return { ...c, ...updates };
      })
    );
    // Also update any student enrolled in this course if name changed
    if (updates.name) {
      setStudents(prev =>
        prev.map(s => (s.courseId === id ? { ...s, courseName: updates.name } : s))
      );
    }
    showToast('Course updated');
  };

  const deleteCourse = (id: string) => {
    const courseToDelete = courses.find(c => c.id === id);
    if (!courseToDelete) return;

    const trashedItem: TrashedCourse = {
      ...courseToDelete,
      deletedAt: new Date().toISOString()
    };

    setCourses(prev => prev.filter(c => c.id !== id));
    setTrashedCourses(prev => [trashedItem, ...prev]);
    showToast(`Course "${courseToDelete.name}" moved to Trash`);
  };

  const restoreCourse = (id: string) => {
    const item = trashedCourses.find(c => c.id === id);
    if (!item) return;

    const { deletedAt, ...restoredCourse } = item;
    setTrashedCourses(prev => prev.filter(c => c.id !== id));
    setCourses(prev => [restoredCourse, ...prev]);
    showToast(`Course "${restoredCourse.name}" restored`);
  };

  const permanentlyDeleteCourse = (id: string) => {
    setTrashedCourses(prev => prev.filter(c => c.id !== id));
    showToast('Course permanently deleted');
  };

  const emptyTrash = () => {
    setTrashedStudents([]);
    setTrashedCourses([]);
    showToast('Trash emptied');
  };

  // Faculty & Attendance
  const addProfessor = (profData: {
    name: string;
    email: string;
    phone: string;
    specialization: string;
    assignedCourses: string[];
    photoUrl?: string;
  }) => {
    const newProf: Professor = {
      id: `prof-${Date.now()}`,
      name: profData.name,
      email: profData.email,
      phone: profData.phone,
      specialization: profData.specialization,
      photoUrl:
        profData.photoUrl ||
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      status: 'ACTIVE',
      assignedCourses: profData.assignedCourses,
      activeStudentCount: 0
    };
    setProfessors(prev => [...prev, newProf]);
    showToast(`Faculty "${profData.name}" added`);
  };

  const markAttendance = (
    studentId: string,
    courseId: string,
    date: string,
    status: 'PRESENT' | 'ABSENT' | 'LATE',
    notes?: string
  ) => {
    const student = students.find(s => s.id === studentId);
    const course = courses.find(c => c.id === courseId);
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setAttendance(prev => {
      const filtered = prev.filter(a => !(a.studentId === studentId && a.date === date));
      const record: AttendanceRecord = {
        id: `att-${Date.now()}-${studentId}`,
        studentId,
        studentName: student?.name || 'Student',
        courseId,
        courseName: course?.name,
        date,
        status,
        checkInAt: status === 'ABSENT' ? undefined : timeStr,
        checkOutAt: undefined,
        markedBy: 'Admin',
        notes
      };
      return [record, ...filtered];
    });

    showToast(`Attendance marked ${status} for ${student?.name || 'Student'}`);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isDarkMode,
        toggleDarkMode,
        courses,
        professors,
        students,
        attendance,
        activities,
        wallets,
        cards,
        trashedStudents,
        trashedCourses,
        settings,
        updateSettings,
        isCustomCursorEnabled,
        toggleCustomCursor,
        addStudent,
        updateStudent,
        deleteStudent,
        restoreStudent,
        permanentlyDeleteStudent,
        addCourse,
        updateCourse,
        deleteCourse,
        restoreCourse,
        permanentlyDeleteCourse,
        emptyTrash,
        addProfessor,
        markAttendance,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

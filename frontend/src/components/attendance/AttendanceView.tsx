import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users, 
  BookOpen, 
  Sparkles, 
  Filter,
  Layers,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/dateMath';
import { CustomDropdown } from '../common/CustomDropdown';
import { CustomDatePicker } from '../common/CustomDatePicker';

export const AttendanceView: React.FC = () => {
  const { courses, students, attendance, markAttendance, settings } = useApp();

  // 'ALL' represents all courses and all students state
  const [selectedCourseId, setSelectedCourseId] = useState<string>('ALL');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const isAllCourses = selectedCourseId === 'ALL';

  // Get active roster: when 'ALL', include all students; otherwise filter by selected course
  const displayedStudents = useMemo(() => {
    if (isAllCourses) {
      return students;
    }
    return students.filter(s => s.courseId === selectedCourseId);
  }, [students, selectedCourseId, isAllCourses]);

  // Attendance records for the selected date
  const recordsForSession = useMemo(() => {
    return attendance.filter(a => {
      const matchesCourse = isAllCourses ? true : a.courseId === selectedCourseId;
      return matchesCourse && a.date === selectedDate;
    });
  }, [attendance, selectedCourseId, selectedDate, isAllCourses]);

  const presentCount = recordsForSession.filter(a => a.status === 'PRESENT').length;
  const lateCount = recordsForSession.filter(a => a.status === 'LATE').length;
  const absentCount = recordsForSession.filter(a => a.status === 'ABSENT').length;
  const markedCount = recordsForSession.length;

  // Overall attendance analysis metrics
  const overallAvgRate = useMemo(() => {
    if (students.length === 0) return 0;
    const sum = students.reduce((acc, s) => acc + (s.attendanceRate || 95), 0);
    return Math.round(sum / students.length);
  }, [students]);

  const atRiskCount = useMemo(() => {
    const threshold = settings.minAttendanceThreshold || 75;
    return students.filter(s => (s.attendanceRate || 95) < threshold).length;
  }, [students, settings.minAttendanceThreshold]);

  const totalSubjectsCount = useMemo(() => {
    const set = new Set<string>();
    courses.forEach(c => c.modules.forEach(m => set.add(m)));
    return set.size;
  }, [courses]);

  const getStudentStatus = (studentId: string) => {
    const rec = recordsForSession.find(r => r.studentId === studentId);
    return rec ? rec.status : null;
  };

  const getStudentCheckIn = (studentId: string) => {
    const rec = recordsForSession.find(r => r.studentId === studentId);
    return rec ? rec.checkInAt : null;
  };

  const courseOptions = [
    { value: 'ALL', label: `All Students & Courses (${students.length})` },
    ...courses.map(c => ({
      value: c.id,
      label: c.name,
      sublabel: `${c.modules.length} subjects • ${c.durationMonths} mo`
    }))
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Minimal Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#141619] dark:text-white">
            Daily Attendance Matrix
          </h1>
          <p className="text-sm text-neutral-400 font-normal mt-0.5">
            {isAllCourses
              ? 'Institutional roll call across all programs with syllabus subjects and overall analysis'
              : `Tracking attendance for ${courses.find(c => c.id === selectedCourseId)?.name || 'Course'}`}
          </p>
        </div>

        {/* Minimal Course Quick Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-[#1A1D22] border border-black/[0.04] dark:border-white/[0.08] shadow-sm">
          <button
            onClick={() => setSelectedCourseId('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isAllCourses
                ? 'bg-[#141619] text-white dark:bg-white dark:text-[#141619] shadow-sm'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-white'
            }`}
          >
            All Students ({students.length})
          </button>
          <button
            onClick={() => setSelectedCourseId(courses[0]?.id || '')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              !isAllCourses
                ? 'bg-[#FF5B26] text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-white'
            }`}
          >
            Course-Wise
          </button>
        </div>
      </div>

      {/* Minimal Control Bar: Course Selector + Date Picker + Stats */}
      <div className="bg-white dark:bg-[#1A1D22] rounded-[28px] p-6 border border-black/[0.04] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* Select Course with CustomDropdown */}
          <div className="w-full sm:w-72">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              Select Course
            </label>
            <CustomDropdown
              value={selectedCourseId}
              onChange={setSelectedCourseId}
              options={courseOptions}
              placeholder="Select Course"
            />
          </div>

          {/* Select Date with CustomDatePicker */}
          <div className="w-full sm:w-56">
            <CustomDatePicker
              label="SESSION DATE"
              value={selectedDate}
              onChange={setSelectedDate}
            />
          </div>
        </div>

        {/* Minimal Session & Overall Analytics Stats */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-neutral-100 dark:border-neutral-800">
          <div className="text-center px-3.5 py-1.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800">
            <span className="text-[10px] uppercase font-bold text-neutral-400">Total Roster</span>
            <p className="text-base font-extrabold text-[#141619] dark:text-white">{displayedStudents.length}</p>
          </div>

          {/* Overall Attendance Analysis Pill when in All Students state */}
          {isAllCourses && (
            <div className="text-center px-3.5 py-1.5 rounded-2xl bg-orange-50 dark:bg-orange-950/30 text-[#FF5B26] border border-orange-200/60 dark:border-orange-900/40">
              <span className="text-[10px] uppercase font-bold">Overall Avg</span>
              <p className="text-base font-extrabold">{overallAvgRate}%</p>
            </div>
          )}

          <div className="text-center px-3 py-1.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
            <span className="text-[10px] uppercase font-bold">Present</span>
            <p className="text-base font-extrabold">{presentCount}</p>
          </div>
          <div className="text-center px-3 py-1.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
            <span className="text-[10px] uppercase font-bold">Late</span>
            <p className="text-base font-extrabold">{lateCount}</p>
          </div>
          <div className="text-center px-3 py-1.5 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600">
            <span className="text-[10px] uppercase font-bold">Absent</span>
            <p className="text-base font-extrabold">{absentCount}</p>
          </div>
        </div>
      </div>

      {/* Minimal Overall Analysis Banner when in "All Students" state */}
      {isAllCourses && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-white dark:bg-[#1A1D22] border border-black/[0.04] dark:border-white/[0.08] text-xs shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF5B26]" />
            <span className="font-bold text-[#141619] dark:text-white">Overall Attendance Analysis:</span>
            <span className="text-neutral-500">
              {students.length} Enrolled Students across {courses.length} Programs
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-neutral-500">
            <span>
              Institution Average: <strong className="text-brand font-bold">{overallAvgRate}%</strong>
            </span>
            <span>•</span>
            <span>
              Subjects Taught: <strong className="text-neutral-800 dark:text-neutral-200 font-bold">{totalSubjectsCount}</strong>
            </span>
            <span>•</span>
            <span>
              Attendance Target: <strong className="text-emerald-600 font-bold">{settings.minAttendanceThreshold || 75}%</strong>
            </span>
            {atRiskCount > 0 && (
              <>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-red-500 font-semibold">
                  <AlertTriangle className="w-3 h-3" />
                  {atRiskCount} {atRiskCount === 1 ? 'student' : 'students'} below threshold
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Roster & Marking Table */}
      <div className="bg-white dark:bg-[#1A1D22] rounded-[28px] p-6 border border-black/[0.04] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#141619] dark:text-white">
            {isAllCourses ? 'All Enrolled Students' : `${courses.find(c => c.id === selectedCourseId)?.name || 'Course'} Students`} for {formatDate(selectedDate)}
          </h3>
          <span className="text-xs text-neutral-400">
            {markedCount} of {displayedStudents.length} marked
          </span>
        </div>

        {displayedStudents.length === 0 ? (
          <div className="py-12 text-center text-neutral-400">
            <p className="text-sm font-semibold">No students found.</p>
            <p className="text-xs text-neutral-500 mt-1">Select another course or view All Students.</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Subjects & Modules</th>
                  <th className="py-3 px-4">Attendance Rate</th>
                  <th className="py-3 px-4">Check-in</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Mark Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
                {displayedStudents.map((student) => {
                  const currentStatus = getStudentStatus(student.id);
                  const checkIn = getStudentCheckIn(student.id);
                  const studentCourse = courses.find(c => c.id === student.courseId);
                  const studentModules = studentCourse?.modules || [];
                  const rate = student.attendanceRate || 95;

                  return (
                    <tr key={student.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                      {/* Student Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.photoUrl}
                            alt={student.name}
                            className="w-9 h-9 rounded-xl object-cover ring-1 ring-neutral-200 dark:ring-neutral-700 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-[#141619] dark:text-white leading-tight">
                              {student.name}
                            </p>
                            <p className="text-[11px] text-neutral-400">{student.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Course */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#141619] dark:text-white block">
                          {student.courseName}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {studentCourse?.durationMonths || 3} mo • {studentCourse?.type === 'TECHNICAL' ? 'Tech' : 'Non-Tech'}
                        </span>
                      </td>

                      {/* Subjects & Modules */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {studentModules.slice(0, 3).map((mod, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[10px] font-medium border border-neutral-200/50 dark:border-neutral-700/50"
                            >
                              {mod}
                            </span>
                          ))}
                          {studentModules.length > 3 && (
                            <span 
                              className="px-1.5 py-0.5 rounded-lg bg-orange-50 dark:bg-orange-950/30 text-brand text-[10px] font-bold"
                              title={studentModules.slice(3).join(', ')}
                            >
                              +{studentModules.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Overall Rate */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                rate >= 85 ? 'bg-emerald-500' : rate >= 75 ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${rate}%` }}
                            />
                          </div>
                          <span className="font-bold font-mono text-neutral-700 dark:text-neutral-300">
                            {rate}%
                          </span>
                        </div>
                      </td>

                      {/* Check-in Time */}
                      <td className="py-3.5 px-4 font-mono text-neutral-500">
                        {checkIn || '—'}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {currentStatus === 'PRESENT' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Present
                          </span>
                        )}
                        {currentStatus === 'LATE' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 dark:bg-amber-950/40">
                            <Clock className="w-3.5 h-3.5" /> Late
                          </span>
                        )}
                        {currentStatus === 'ABSENT' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 dark:bg-red-950/40">
                            <XCircle className="w-3.5 h-3.5" /> Absent
                          </span>
                        )}
                        {!currentStatus && (
                          <span className="text-neutral-400 font-medium italic">Not Marked</span>
                        )}
                      </td>

                      {/* Quick Mark Action */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800/80 p-1 rounded-2xl">
                          <button
                            onClick={() => markAttendance(student.id, student.courseId, selectedDate, 'PRESENT')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              currentStatus === 'PRESENT'
                                ? 'bg-emerald-500 text-white shadow-sm'
                                : 'text-neutral-500 hover:text-emerald-600 hover:bg-white dark:hover:bg-neutral-700'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            onClick={() => markAttendance(student.id, student.courseId, selectedDate, 'LATE')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              currentStatus === 'LATE'
                                ? 'bg-amber-500 text-white shadow-sm'
                                : 'text-neutral-500 hover:text-amber-600 hover:bg-white dark:hover:bg-neutral-700'
                            }`}
                          >
                            Late
                          </button>
                          <button
                            onClick={() => markAttendance(student.id, student.courseId, selectedDate, 'ABSENT')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              currentStatus === 'ABSENT'
                                ? 'bg-red-500 text-white shadow-sm'
                                : 'text-neutral-500 hover:text-red-600 hover:bg-white dark:hover:bg-neutral-700'
                            }`}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

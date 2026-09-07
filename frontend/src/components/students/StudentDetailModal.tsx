import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, BookOpen, UserCheck, Clock, CheckCircle2, AlertCircle, Trash2, Edit3 } from 'lucide-react';
import { Student } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/dateMath';
import { EditStudentModal } from './EditStudentModal';

export const StudentDetailModal: React.FC<{ 
  student: Student; 
  onClose: () => void;
  onEdit?: (student: Student) => void;
}> = ({ student, onClose, onEdit }) => {
  const { courses, professors, attendance, deleteStudent } = useApp();
  const [isEditingSelf, setIsEditingSelf] = useState(false);

  const course = courses.find(c => c.id === student.courseId);
  const professor = professors.find(p => p.id === student.professorId);
  const studentAttendance = attendance.filter(a => a.studentId === student.id);

  const getStatusBadge = (status: Student['status']) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">Active</span>;
      case 'UPCOMING':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">Upcoming</span>;
      case 'COMPLETED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">Completed</span>;
      case 'DROPPED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400">Dropped</span>;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="bg-white dark:bg-[#1A1D22] w-full max-w-2xl rounded-[32px] p-7 shadow-2xl border border-black/[0.06] dark:border-white/[0.08] max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-5 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-4">
              <img
                src={student.photoUrl}
                alt={student.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-neutral-200 dark:ring-neutral-700"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-[#141619] dark:text-white">
                    {student.name}
                  </h3>
                  {getStatusBadge(student.status)}
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">{student.email} • {student.phone}</p>
                <p className="text-xs font-semibold text-[#FF5B26] mt-1 font-mono">ID: {student.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Enrollment Window Timeline Card */}
          <div className="mt-6 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF5B26]/10 text-[#FF5B26] flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-400 uppercase">Enrollment Period</p>
                <p className="text-sm font-extrabold text-[#141619] dark:text-white">
                  {formatDate(student.startDate)} → {formatDate(student.endDate)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-neutral-400">Duration</span>
              <p className="text-sm font-black text-[#FF5B26]">
                {course?.durationMonths || 3} Months
              </p>
            </div>
          </div>

          {/* Course & Modules Syllabus */}
          <div className="mt-6">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Enrolled Course & Syllabus Modules
            </h4>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#141619] border border-neutral-200/80 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-[#141619] dark:text-white">
                  {course?.name}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 font-semibold text-neutral-600 dark:text-neutral-300">
                  {course?.type === 'TECHNICAL' ? 'Technical' : 'Non-Technical'}
                </span>
              </div>

              {/* Modules Badges */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {course?.modules.map((mod, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-orange-50 dark:bg-orange-950/30 text-[#FF5B26] text-xs font-semibold border border-orange-100 dark:border-orange-900/40"
                  >
                    {mod}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Assigned Faculty */}
          <div className="mt-5">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" /> Assigned Faculty Mentor
            </h4>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#141619] border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={professor?.photoUrl}
                  alt={professor?.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-[#141619] dark:text-white">{professor?.name}</p>
                  <p className="text-xs text-neutral-400">{professor?.specialization}</p>
                </div>
              </div>
              <span className="text-xs font-medium text-neutral-500 font-mono">{professor?.email}</span>
            </div>
          </div>

          {/* Attendance Log */}
          <div className="mt-5">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Attendance History
            </h4>
            <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 overflow-hidden">
              {studentAttendance.length === 0 ? (
                <p className="p-4 text-xs text-neutral-400 text-center">No attendance sessions recorded yet.</p>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-400 font-semibold border-b border-neutral-200 dark:border-neutral-700">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Check-in</th>
                      <th className="p-3">Marked By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {studentAttendance.map((rec) => (
                      <tr key={rec.id}>
                        <td className="p-3 font-medium">{formatDate(rec.date)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            rec.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' :
                            rec.status === 'LATE' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' : 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                          }`}>
                            {rec.status}
                          </span>
                        </td>
                        <td className="p-3 text-neutral-500 font-mono">{rec.checkInAt || '—'}</td>
                        <td className="p-3 text-neutral-500">{rec.markedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (confirm(`Move student record for ${student.name} to Trash?`)) {
                    deleteStudent(student.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> Move to Trash
              </button>
              <button
                onClick={() => {
                  if (onEdit) {
                    onEdit(student);
                  } else {
                    setIsEditingSelf(true);
                  }
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:text-brand transition-colors cursor-pointer"
              >
                <Edit3 className="w-4 h-4" /> Edit Profile
              </button>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-[#141619] dark:bg-white text-white dark:text-[#141619] text-xs font-bold cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>

      {isEditingSelf && (
        <EditStudentModal
          student={student}
          onClose={() => {
            setIsEditingSelf(false);
            onClose();
          }}
        />
      )}
    </>
  );
};

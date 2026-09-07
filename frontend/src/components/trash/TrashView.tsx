import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  RotateCcw, 
  AlertTriangle, 
  User, 
  BookOpen, 
  Calendar, 
  Phone, 
  Mail, 
  Clock, 
  Search,
  CheckCircle2,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/dateMath';

export const TrashView: React.FC = () => {
  const { 
    trashedStudents, 
    trashedCourses, 
    restoreStudent, 
    permanentlyDeleteStudent, 
    restoreCourse, 
    permanentlyDeleteCourse, 
    emptyTrash 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'students' | 'courses'>('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredStudents = trashedStudents.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.courseName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCourses = trashedCourses.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.modules.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalTrashedCount = trashedStudents.length + trashedCourses.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-2xl border border-zinc-700/20 font-medium text-sm"
          >
            <CheckCircle2 className="w-5 h-5 text-brand" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#1A1D22] border border-black/[0.04] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center text-red-500 border border-red-500/20">
            <Trash2 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
              Recycle Bin & Trash
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400">
                {totalTrashedCount} {totalTrashedCount === 1 ? 'item' : 'items'}
              </span>
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              Items stored here can be restored back to active records or permanently purged.
            </p>
          </div>
        </div>

        {totalTrashedCount > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowEmptyConfirm(true)}
              className="px-4 py-2.5 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 font-semibold text-sm transition-all flex items-center gap-2 border border-red-200/60 dark:border-red-800/40 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              Empty Trash
            </button>
          </div>
        )}
      </div>

      {/* Tabs & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Subtabs */}
        <div className="flex items-center p-1.5 rounded-2xl bg-zinc-100/80 dark:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-700/50 w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab('students')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeSubTab === 'students'
                ? 'bg-white dark:bg-[#1E2024] text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <User className="w-4 h-4 text-brand" />
            <span>Students ({trashedStudents.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('courses')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeSubTab === 'courses'
                ? 'bg-white dark:bg-[#1E2024] text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span>Courses ({trashedCourses.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search deleted ${activeSubTab}...`}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-2xl bg-white dark:bg-[#1A1D22] border border-black/[0.06] dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
          />
        </div>
      </div>

      {/* Content Area */}
      {activeSubTab === 'students' ? (
        filteredStudents.length === 0 ? (
          <div className="py-20 text-center bg-white dark:bg-[#1A1D22] rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 flex flex-col items-center justify-center p-8">
            <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center text-zinc-400 mb-4">
              <Trash2 className="w-8 h-8 opacity-40" />
            </div>
            <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">No Trashed Students</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mt-1">
              {searchQuery ? 'No deleted students match your search criteria.' : 'When students are deleted from the directory, they will safely appear here.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStudents.map((student) => (
              <motion.div
                key={student.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-5 rounded-3xl bg-white dark:bg-[#1A1D22] border border-black/[0.04] dark:border-white/[0.08] hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60 overflow-hidden">
                        {student.photoUrl ? (
                          <img src={student.photoUrl} alt={student.name} className="w-full h-full object-cover" />
                        ) : (
                          student.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-900 dark:text-white leading-tight">
                          {student.name}
                        </h4>
                        <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                          {student.id} • {student.courseName}
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" />
                      Trashed
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-neutral-800/60 p-3 rounded-2xl">
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                      <span className="truncate">{student.email}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <Phone className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                      <span>{student.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <Calendar className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                      <span>Deleted: {student.deletedAt ? new Date(student.deletedAt).toLocaleDateString() : 'Recently'}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                        {student.attendanceRate || 95}% Attendance
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      restoreStudent(student.id);
                      triggerToast(`${student.name} restored to active students.`);
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-brand hover:text-white dark:hover:bg-brand dark:hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restore Student
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Permanently delete ${student.name}? This cannot be undone.`)) {
                        permanentlyDeleteStudent(student.id);
                        triggerToast(`${student.name} permanently deleted.`);
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Purge
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )
      ) : (
        filteredCourses.length === 0 ? (
          <div className="py-20 text-center bg-white dark:bg-[#1A1D22] rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 flex flex-col items-center justify-center p-8">
            <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center text-zinc-400 mb-4">
              <BookOpen className="w-8 h-8 opacity-40" />
            </div>
            <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">No Trashed Courses</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mt-1">
              {searchQuery ? 'No archived courses match your search query.' : 'Archived courses and curricula moved to trash will appear here.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCourses.map((course) => (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-5 rounded-3xl bg-white dark:bg-[#1A1D22] border border-black/[0.04] dark:border-white/[0.08] hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-brand uppercase tracking-wider">
                        {course.type === 'TECHNICAL' ? 'Technical' : 'Non-Technical'}
                      </span>
                      <h4 className="font-bold text-base text-zinc-900 dark:text-white mt-1">
                        {course.name}
                      </h4>
                    </div>

                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" />
                      Archived
                    </span>
                  </div>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-neutral-800/60 p-3 rounded-2xl">
                    <span className="px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium">
                      Duration: {course.durationMonths} Months
                    </span>
                    <span>•</span>
                    <span>Modules: {course.modules.slice(0, 3).join(', ')}{course.modules.length > 3 ? '...' : ''}</span>
                    <span>•</span>
                    <span>Deleted: {course.deletedAt ? new Date(course.deletedAt).toLocaleDateString() : 'Recently'}</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      restoreCourse(course.id);
                      triggerToast(`${course.name} restored to course offerings.`);
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-brand hover:text-white dark:hover:bg-brand dark:hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restore Course
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Permanently purge ${course.name}? This cannot be undone.`)) {
                        permanentlyDeleteCourse(course.id);
                        triggerToast(`${course.name} permanently deleted.`);
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Purge
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )
      )}

      {/* Empty Trash Confirmation Modal */}
      <AnimatePresence>
        {showEmptyConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-[#1A1D22] rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Permanently Empty Recycle Bin?
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  This action will permanently purge all {totalTrashedCount} trashed student records and archived courses. This operation cannot be reversed.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEmptyConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    emptyTrash();
                    setShowEmptyConfirm(false);
                    triggerToast('Trash has been completely emptied.');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 cursor-pointer"
                >
                  Yes, Empty All
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

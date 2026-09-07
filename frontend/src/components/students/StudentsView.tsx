import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, UserPlus, Eye, Calendar, BookOpen, GraduationCap, ChevronRight, Edit3, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { formatDate } from '../../utils/dateMath';
import { EnrollStudentModal } from './EnrollStudentModal';
import { StudentDetailModal } from './StudentDetailModal';
import { EditStudentModal } from './EditStudentModal';
import { CustomDropdown } from '../common/CustomDropdown';

export const StudentsView: React.FC = () => {
  const { students, courses, professors, deleteStudent } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');
  const [selectedProfFilter, setSelectedProfFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Filter students based on all criteria
  const filteredStudents = students.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search);

    const matchesCourse = selectedCourseFilter === 'ALL' || s.courseId === selectedCourseFilter;
    const matchesProf = selectedProfFilter === 'ALL' || s.professorId === selectedProfFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || s.status === selectedStatusFilter;

    return matchesSearch && matchesCourse && matchesProf && matchesStatus;
  });

  const getStatusBadge = (status: Student['status']) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
          </span>
        );
      case 'UPCOMING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-950/40">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Upcoming
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" /> Completed
          </span>
        );
      case 'DROPPED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 dark:bg-red-950/40">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Dropped
          </span>
        );
    }
  };

  const courseFilterOptions = [
    { value: 'ALL', label: 'All Courses' },
    ...courses.map(c => ({ value: c.id, label: c.name }))
  ];

  const profFilterOptions = [
    { value: 'ALL', label: 'All Faculty' },
    ...professors.map(p => ({ value: p.id, label: p.name }))
  ];

  const statusFilterOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'UPCOMING', label: 'Upcoming' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'DROPPED', label: 'Dropped' }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#141619] dark:text-white">
            Student Management
          </h1>
          <p className="text-sm text-neutral-400 font-normal mt-0.5">
            Auto-calculates course completion end date from duration in months
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowEnrollModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#FF5B26] hover:bg-[#EE4A15] text-white text-sm font-bold shadow-[0_4px_16px_rgba(255,91,38,0.35)] transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Enroll New Student</span>
        </motion.button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#1A1D22] rounded-[28px] p-5 border border-black/[0.04] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-neutral-100/80 dark:bg-neutral-800 text-xs font-medium outline-none text-[#141619] dark:text-white placeholder:text-neutral-400 focus:ring-1 focus:ring-black/10 transition-all"
          />
        </div>

        {/* Dropdown Filters with CustomDropdown */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Course filter */}
          <div className="w-44">
            <CustomDropdown
              value={selectedCourseFilter}
              onChange={setSelectedCourseFilter}
              options={courseFilterOptions}
              placeholder="Filter by Course"
            />
          </div>

          {/* Professor filter */}
          <div className="w-40">
            <CustomDropdown
              value={selectedProfFilter}
              onChange={setSelectedProfFilter}
              options={profFilterOptions}
              placeholder="Filter by Faculty"
            />
          </div>

          {/* Status filter */}
          <div className="w-36">
            <CustomDropdown
              value={selectedStatusFilter}
              onChange={setSelectedStatusFilter}
              options={statusFilterOptions}
              placeholder="Filter by Status"
            />
          </div>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white dark:bg-[#1A1D22] rounded-[28px] p-6 border border-black/[0.04] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-neutral-800 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Enrolled Course</th>
                <th className="py-3 px-4">Assigned Mentor</th>
                <th className="py-3 px-4">Enrollment Window</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-400 font-medium">
                    No students found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stud) => (
                  <tr
                    key={stud.id}
                    onClick={() => setViewingStudent(stud)}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={stud.photoUrl}
                          alt={stud.name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <p className="font-bold text-[#141619] dark:text-white group-hover:text-[#FF5B26] transition-colors">
                            {stud.name}
                          </p>
                          <p className="text-[11px] text-neutral-400">{stud.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#141619] dark:text-white">
                        {stud.courseName}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-300 font-medium">
                      {stud.professorName}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col font-mono text-[11px]">
                        <span className="text-neutral-600 dark:text-neutral-300">
                          {formatDate(stud.startDate)}
                        </span>
                        <span className="text-[#FF5B26] font-bold">
                          → {formatDate(stud.endDate)}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(stud.status)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#10B981]"
                            style={{ width: `${stud.attendanceRate || 95}%` }}
                          />
                        </div>
                        <span className="font-bold text-neutral-700 dark:text-neutral-300 font-mono">
                          {stud.attendanceRate || 95}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setEditingStudent(stud)}
                          className="p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-brand transition-colors cursor-pointer"
                          title="Edit Student"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Move ${stud.name} to Trash?`)) {
                              deleteStudent(stud.id);
                            }
                          }}
                          className="p-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                          title="Move to Trash"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setViewingStudent(stud)}
                          className="p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-[#FF5B26] transition-colors cursor-pointer"
                          title="View Full Profile"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showEnrollModal && (
        <EnrollStudentModal onClose={() => setShowEnrollModal(false)} />
      )}

      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
        />
      )}

      {viewingStudent && (
        <StudentDetailModal
          student={viewingStudent}
          onClose={() => setViewingStudent(null)}
        />
      )}
    </div>
  );
};

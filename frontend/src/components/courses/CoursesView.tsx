import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Clock, Users, Layers, Sparkles, Edit3, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';
import { AddCourseModal } from './AddCourseModal';
import { EditCourseModal } from './EditCourseModal';

export const CoursesView: React.FC = () => {
  const { courses, students, deleteCourse } = useApp();
  const [filterType, setFilterType] = useState<'ALL' | 'TECHNICAL' | 'NON_TECHNICAL'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const filteredCourses = courses.filter(c => {
    if (filterType === 'ALL') return true;
    return c.type === filterType;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#141619] dark:text-white">
            Course Catalog & Syllabi
          </h1>
          <p className="text-sm text-neutral-400 font-normal mt-0.5">
            Technical & Non-Technical training paths with modular skill trees
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#FF5B26] hover:bg-[#EE4A15] text-white text-sm font-bold shadow-[0_4px_16px_rgba(255,91,38,0.35)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Course</span>
        </motion.button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterType('ALL')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            filterType === 'ALL'
              ? 'bg-[#141619] dark:bg-white text-white dark:text-[#141619] shadow-sm'
              : 'bg-white dark:bg-[#1A1D22] text-neutral-500 hover:text-neutral-800 dark:hover:text-white'
          }`}
        >
          All Programs ({courses.length})
        </button>
        <button
          onClick={() => setFilterType('TECHNICAL')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            filterType === 'TECHNICAL'
              ? 'bg-[#141619] dark:bg-white text-white dark:text-[#141619] shadow-sm'
              : 'bg-white dark:bg-[#1A1D22] text-neutral-500 hover:text-neutral-800 dark:hover:text-white'
          }`}
        >
          Technical ({courses.filter(c => c.type === 'TECHNICAL').length})
        </button>
        <button
          onClick={() => setFilterType('NON_TECHNICAL')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            filterType === 'NON_TECHNICAL'
              ? 'bg-[#141619] dark:bg-white text-white dark:text-[#141619] shadow-sm'
              : 'bg-white dark:bg-[#1A1D22] text-neutral-500 hover:text-neutral-800 dark:hover:text-white'
          }`}
        >
          Non-Technical ({courses.filter(c => c.type === 'NON_TECHNICAL').length})
        </button>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const studentCount = students.filter(s => s.courseId === course.id && s.status === 'ACTIVE').length;

          return (
            <motion.div
              key={course.id}
              whileHover={{ y: -4, scale: 1.01 }}
              className="bg-white dark:bg-[#1A1D22] rounded-[28px] p-6 border border-black/[0.04] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between"
            >
              <div>
                {/* Badges & Actions */}
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    course.type === 'TECHNICAL'
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                      : 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400'
                  }`}>
                    {course.type === 'TECHNICAL' ? 'Technical' : 'Non-Technical'}
                  </span>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs font-bold text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-full">
                      <Clock className="w-3.5 h-3.5 text-[#FF5B26]" />
                      <span>{course.durationMonths} Months</span>
                    </div>

                    <button
                      onClick={() => setEditingCourse(course)}
                      className="p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-brand transition-colors cursor-pointer"
                      title="Edit Course"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Move course "${course.name}" to Trash?`)) {
                          deleteCourse(course.id);
                        }
                      }}
                      className="p-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                      title="Move to Trash"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Course Name */}
                <h3 className="text-lg font-black text-[#141619] dark:text-white mt-4">
                  {course.name}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                  {course.description}
                </p>

                {/* Modules list */}
                <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                    Syllabus Topics ({course.modules.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {course.modules.map((mod, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-lg bg-[#F7F8FA] dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300 text-[11px] font-medium border border-black/[0.02]"
                      >
                        {mod}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom metadata */}
              <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-neutral-500">
                  <Users className="w-3.5 h-3.5 text-[#FF5B26]" />
                  <span className="font-bold text-[#141619] dark:text-white">{studentCount}</span>
                  <span>enrolled students</span>
                </div>

                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Create Modal */}
      {showAddModal && (
        <AddCourseModal onClose={() => setShowAddModal(false)} />
      )}

      {/* Edit Modal */}
      {editingCourse && (
        <EditCourseModal
          course={editingCourse}
          onClose={() => setEditingCourse(null)}
        />
      )}
    </div>
  );
};

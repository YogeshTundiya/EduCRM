import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Plus, Mail, Phone, BookOpen, Users, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AddProfessorModal } from './AddProfessorModal';

export const ProfessorsView: React.FC = () => {
  const { professors, courses, students } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProfId, setSelectedProfId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#141619] dark:text-white">
            Faculty & Mentorship
          </h1>
          <p className="text-sm text-neutral-400 font-normal mt-0.5">
            Manage instructors, course assignments, and student mentorship rosters
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#FF5B26] hover:bg-[#EE4A15] text-white text-sm font-bold shadow-[0_4px_16px_rgba(255,91,38,0.35)] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Professor</span>
        </motion.button>
      </div>

      {/* Professors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {professors.map((prof) => {
          const assignedCourseObjects = courses.filter(c => prof.assignedCourses.includes(c.id));
          const assignedStudents = students.filter(s => s.professorId === prof.id);

          return (
            <motion.div
              key={prof.id}
              whileHover={{ y: -4, scale: 1.01 }}
              className="bg-white dark:bg-[#1A1D22] rounded-[28px] p-6 border border-black/[0.04] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={prof.photoUrl}
                      alt={prof.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-neutral-200 dark:ring-neutral-700"
                    />
                    <div>
                      <h3 className="text-lg font-black text-[#141619] dark:text-white">
                        {prof.name}
                      </h3>
                      <p className="text-xs font-semibold text-[#FF5B26]">
                        {prof.specialization}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-neutral-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {prof.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {prof.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 text-[11px] font-bold">
                    Active
                  </span>
                </div>

                {/* Assigned Courses */}
                <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                    Assigned Courses ({assignedCourseObjects.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {assignedCourseObjects.map((c) => (
                      <span
                        key={c.id}
                        className="px-2.5 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium"
                      >
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Assigned Students Roster */}
                <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      Mentored Students ({assignedStudents.length})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2 overflow-hidden">
                      {assignedStudents.slice(0, 5).map((s) => (
                        <img
                          key={s.id}
                          src={s.photoUrl}
                          alt={s.name}
                          title={s.name}
                          className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#1A1D22] object-cover"
                        />
                      ))}
                    </div>
                    {assignedStudents.length > 5 && (
                      <span className="text-xs font-bold text-neutral-400">
                        +{assignedStudents.length - 5} more
                      </span>
                    )}
                    <span className="text-xs text-neutral-500 font-medium ml-auto">
                      {assignedStudents.length} Active Mentees
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {showAddModal && (
        <AddProfessorModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
};

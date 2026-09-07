import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, Mail, Phone, BookOpen, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AddProfessorModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { courses, addProfessor } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [assignedCourses, setAssignedCourses] = useState<string[]>([courses[0]?.id || '']);

  const toggleCourse = (cId: string) => {
    if (assignedCourses.includes(cId)) {
      setAssignedCourses(assignedCourses.filter(id => id !== cId));
    } else {
      setAssignedCourses([...assignedCourses, cId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !specialization) return;

    addProfessor({
      name,
      email,
      phone: phone || '+1 (555) 789-0123',
      specialization,
      assignedCourses
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        className="bg-white dark:bg-[#1A1D22] w-full max-w-lg rounded-[28px] p-7 shadow-2xl border border-black/[0.06]"
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h3 className="text-xl font-extrabold text-[#141619] dark:text-white">
              Add Faculty Member
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Assign professor to teaching courses and student mentorship
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
              Professor Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Maya Lin"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-sm font-medium outline-none focus:border-[#FF5B26] text-[#141619] dark:text-white"
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="maya.lin@technoglobe.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-4 py-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-sm font-medium outline-none focus:border-[#FF5B26] text-[#141619] dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
                Phone
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 789-0123"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full mt-1 px-4 py-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-sm font-medium outline-none focus:border-[#FF5B26] text-[#141619] dark:text-white"
              />
            </div>
          </div>

          {/* Specialization */}
          <div>
            <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
              Specialization / Core Domain *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Distributed Cloud & Security"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-sm font-medium outline-none focus:border-[#FF5B26] text-[#141619] dark:text-white"
            />
          </div>

          {/* Assigned Courses */}
          <div>
            <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
              Assigned Courses to Teach
            </label>
            <div className="mt-2 space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {courses.map((course) => {
                const isSelected = assignedCourses.includes(course.id);
                return (
                  <div
                    key={course.id}
                    onClick={() => toggleCourse(course.id)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-orange-50 dark:bg-orange-950/40 border-[#FF5B26] text-[#FF5B26]'
                        : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    <span>{course.name}</span>
                    <span className="text-[10px] uppercase font-mono">{course.type}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action */}
          <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-neutral-500 hover:text-neutral-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#FF5B26] hover:bg-[#EE4A15] text-white text-xs font-bold shadow-[0_4px_16px_rgba(255,91,38,0.35)]"
            >
              Add Professor
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

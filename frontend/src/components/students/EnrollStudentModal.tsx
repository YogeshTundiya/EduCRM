import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Sparkles, BookOpen, UserCheck, Mail, Phone, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateEndDate } from '../../utils/dateMath';
import { CustomDropdown } from '../common/CustomDropdown';
import { CustomDatePicker } from '../common/CustomDatePicker';
import confetti from 'canvas-confetti';

export const EnrollStudentModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { courses, professors, addStudent } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [professorId, setProfessorId] = useState(professors[0]?.id || '');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [calculatedEnd, setCalculatedEnd] = useState('');

  // Selected course details
  const selectedCourse = courses.find(c => c.id === courseId);

  // Live recalculate end date whenever startDate or courseId changes
  useEffect(() => {
    if (selectedCourse && startDate) {
      const end = calculateEndDate(startDate, selectedCourse.durationMonths);
      setCalculatedEnd(end);
    }
  }, [courseId, startDate, selectedCourse]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !courseId || !professorId || !startDate) return;

    addStudent({
      name,
      email,
      phone: phone || '+1 (555) 000-0000',
      courseId,
      professorId,
      startDate
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (err) {
      // Ignore if canvas-confetti unsupported
    }

    onClose();
  };

  const courseOptions = courses.map((c) => ({
    value: c.id,
    label: `${c.name} (${c.durationMonths} mo • ${c.type === 'TECHNICAL' ? 'Tech' : 'Non-Tech'})`
  }));

  const professorOptions = professors.map((p) => ({
    value: p.id,
    label: `${p.name} (${p.specialization})`
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        className="bg-white dark:bg-[#1A1D22] w-full max-w-lg rounded-[28px] p-7 shadow-2xl border border-black/[0.06] dark:border-white/[0.08]"
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h3 className="text-xl font-extrabold text-[#141619] dark:text-white">
              Enroll New Student
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Course end date will be automatically computed based on duration
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Full Name */}
          <div>
            <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
              Student Full Name *
            </label>
            <div className="relative mt-1">
              <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. Jordan Hayes"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-sm font-medium outline-none focus:border-[#FF5B26] transition-colors text-[#141619] dark:text-white"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
                Email Address *
              </label>
              <div className="relative mt-1">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="jordan@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-sm font-medium outline-none focus:border-[#FF5B26] transition-colors text-[#141619] dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
                Phone Number
              </label>
              <div className="relative mt-1">
                <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-sm font-medium outline-none focus:border-[#FF5B26] transition-colors text-[#141619] dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Course Selection via CustomDropdown */}
          <div>
            <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300 block mb-1">
              Enrolled Course *
            </label>
            <CustomDropdown
              value={courseId}
              onChange={setCourseId}
              options={courseOptions}
              placeholder="Select Course"
            />
          </div>

          {/* Assigned Professor via CustomDropdown */}
          <div>
            <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300 block mb-1">
              Assigned Faculty / Mentor *
            </label>
            <CustomDropdown
              value={professorId}
              onChange={setProfessorId}
              options={professorOptions}
              placeholder="Select Faculty Mentor"
            />
          </div>

          {/* Start Date & Auto-Calculated End Date Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <CustomDatePicker
                label="Enrollment Start Date *"
                value={startDate}
                onChange={setStartDate}
              />
            </div>

            {/* Computed End Date Preview */}
            <div className="flex flex-col justify-end">
              <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300 flex items-center gap-1 mb-1">
                Computed End Date
                <Sparkles className="w-3 h-3 text-[#FF5B26]" />
              </label>
              <div className="py-2.5 px-3 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 text-sm font-mono font-bold text-[#FF5B26] flex items-center justify-between">
                <span>{calculatedEnd || '---'}</span>
                <span className="text-[10px] font-sans font-semibold text-neutral-500">
                  +{selectedCourse?.durationMonths || 0} mo
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#FF5B26] hover:bg-[#EE4A15] text-white text-xs font-bold shadow-[0_4px_16px_rgba(255,91,38,0.35)] transition-all cursor-pointer"
            >
              Confirm Enrollment
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

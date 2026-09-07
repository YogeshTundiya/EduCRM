import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Mail, Phone, User, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { calculateEndDate } from '../../utils/dateMath';
import { CustomDropdown } from '../common/CustomDropdown';
import { CustomDatePicker } from '../common/CustomDatePicker';

interface EditStudentModalProps {
  student: Student;
  onClose: () => void;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({ student, onClose }) => {
  const { courses, professors, updateStudent } = useApp();

  const [name, setName] = useState(student.name);
  const [email, setEmail] = useState(student.email);
  const [phone, setPhone] = useState(student.phone);
  const [courseId, setCourseId] = useState(student.courseId);
  const [professorId, setProfessorId] = useState(student.professorId);
  const [startDate, setStartDate] = useState(student.startDate);
  const [status, setStatus] = useState<Student['status']>(student.status);
  const [calculatedEnd, setCalculatedEnd] = useState(student.endDate);

  const selectedCourse = courses.find((c) => c.id === courseId);

  useEffect(() => {
    if (selectedCourse && startDate) {
      const end = calculateEndDate(startDate, selectedCourse.durationMonths);
      setCalculatedEnd(end);
    }
  }, [courseId, startDate, selectedCourse]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !courseId || !professorId || !startDate) return;

    const professor = professors.find((p) => p.id === professorId);

    updateStudent(student.id, {
      name,
      email,
      phone,
      courseId,
      courseName: selectedCourse?.name || student.courseName,
      professorId,
      professorName: professor?.name || student.professorName,
      startDate,
      endDate: calculatedEnd,
      status
    });

    onClose();
  };

  const courseOptions = courses.map((c) => ({
    value: c.id,
    label: c.name,
    sublabel: `${c.durationMonths} months · ${c.type === 'TECHNICAL' ? 'Technical' : 'Non-Tech'}`
  }));

  const professorOptions = professors.map((p) => ({
    value: p.id,
    label: p.name,
    sublabel: p.specialization
  }));

  const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'UPCOMING', label: 'Upcoming' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'DROPPED', label: 'Dropped' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white dark:bg-[#1A1D22] w-full max-w-lg rounded-[28px] p-6 sm:p-7 shadow-2xl border border-black/[0.06] dark:border-white/[0.08]"
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h3 className="text-xl font-bold text-[#141619] dark:text-white">
              Edit Student Record
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5 font-mono">{student.id}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
              Student Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-neutral-50/80 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-sm font-medium outline-none focus:border-[#FF5B26] transition-colors text-[#141619] dark:text-white"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-full bg-neutral-50/80 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-sm font-medium outline-none focus:border-[#FF5B26] transition-colors text-[#141619] dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-full bg-neutral-50/80 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-sm font-medium outline-none focus:border-[#FF5B26] transition-colors text-[#141619] dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Course Custom Dropdown */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
              Enrolled Course *
            </label>
            <CustomDropdown
              options={courseOptions}
              value={courseId}
              onChange={setCourseId}
              searchable
            />
          </div>

          {/* Faculty Custom Dropdown */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
              Assigned Faculty *
            </label>
            <CustomDropdown
              options={professorOptions}
              value={professorId}
              onChange={setProfessorId}
              searchable
            />
          </div>

          {/* Status Custom Dropdown */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
              Enrollment Status
            </label>
            <CustomDropdown
              options={statusOptions}
              value={status}
              onChange={(val) => setStatus(val as Student['status'])}
            />
          </div>

          {/* Start Date & Computed End Date Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                Enrollment Start Date *
              </label>
              <CustomDatePicker value={startDate} onChange={setStartDate} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 flex items-center gap-1">
                Computed End Date
                <Sparkles className="w-3 h-3 text-[#FF5B26]" />
              </label>
              <div className="py-2.5 px-4 rounded-full bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 text-xs font-mono font-bold text-[#FF5B26] flex items-center justify-between">
                <span>{calculatedEnd || '---'}</span>
                <span className="text-[10px] text-neutral-500 font-sans">
                  +{selectedCourse?.durationMonths || 0} mo
                </span>
              </div>
            </div>
          </div>

          {/* Submit / Cancel Actions */}
          <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#FF5B26] hover:bg-[#EE4A15] text-white text-xs font-bold shadow-[0_4px_16px_rgba(255,91,38,0.35)] transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

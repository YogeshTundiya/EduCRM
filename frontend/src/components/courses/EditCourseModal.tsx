import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, BookOpen, Clock, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course, CourseType } from '../../types';
import { CustomDropdown } from '../common/CustomDropdown';

interface EditCourseModalProps {
  course: Course;
  onClose: () => void;
}

export const EditCourseModal: React.FC<EditCourseModalProps> = ({ course, onClose }) => {
  const { updateCourse } = useApp();

  const [name, setName] = useState(course.name);
  const [type, setType] = useState<CourseType>(course.type);
  const [durationMonths, setDurationMonths] = useState(course.durationMonths);
  const [description, setDescription] = useState(course.description || '');
  const [modules, setModules] = useState<string[]>([...course.modules]);
  const [newModuleInput, setNewModuleInput] = useState('');

  const handleAddModule = () => {
    if (!newModuleInput.trim()) return;
    if (!modules.includes(newModuleInput.trim())) {
      setModules((prev) => [...prev, newModuleInput.trim()]);
    }
    setNewModuleInput('');
  };

  const handleRemoveModule = (indexToRemove: number) => {
    setModules((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateCourse(course.id, {
      name: name.trim(),
      type,
      durationMonths: Number(durationMonths) || 3,
      description: description.trim(),
      modules
    });

    onClose();
  };

  const typeOptions = [
    { value: 'TECHNICAL', label: 'Technical Program', sublabel: 'Software, Web, Cloud & Security' },
    { value: 'NON_TECHNICAL', label: 'Non-Technical Program', sublabel: 'UI/UX Design, Management & Creative' }
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
              Edit Course Syllabus
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5 font-mono">{course.id}</p>
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
          {/* Course Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
              Course Title *
            </label>
            <div className="relative">
              <BookOpen className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Full Stack Web Development"
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-neutral-50/80 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-sm font-medium outline-none focus:border-[#FF5B26] transition-colors text-[#141619] dark:text-white"
              />
            </div>
          </div>

          {/* Program Type Custom Dropdown */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
              Program Classification *
            </label>
            <CustomDropdown
              options={typeOptions}
              value={type}
              onChange={(val) => setType(val as CourseType)}
            />
          </div>

          {/* Duration Months */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
              Duration (Months) *
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                required
                min={1}
                max={36}
                value={durationMonths}
                onChange={(e) => setDurationMonths(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-neutral-50/80 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-sm font-medium outline-none focus:border-[#FF5B26] transition-colors text-[#141619] dark:text-white"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
              Course Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Overview of curriculum..."
              className="w-full px-4 py-2 rounded-2xl bg-neutral-50/80 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs font-medium outline-none focus:border-[#FF5B26] transition-colors text-[#141619] dark:text-white resize-none"
            />
          </div>

          {/* Modules / Topics */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
              Modules & Skills ({modules.length})
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add topic (e.g. Next.js)..."
                value={newModuleInput}
                onChange={(e) => setNewModuleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddModule();
                  }
                }}
                className="flex-1 px-4 py-2 rounded-full bg-neutral-50/80 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs font-medium outline-none focus:border-[#FF5B26] text-[#141619] dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddModule}
                className="px-4 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-[#FF5B26] hover:text-white text-xs font-bold text-neutral-700 dark:text-neutral-300 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pt-1">
              {modules.map((mod, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5B26]/10 text-[#FF5B26] text-xs font-medium"
                >
                  <span>{mod}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveModule(idx)}
                    className="hover:opacity-75"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
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
              <span>Save Course</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

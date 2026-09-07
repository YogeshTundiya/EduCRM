import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, BookOpen, Clock, Tag, Plus, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CustomDropdown } from '../common/CustomDropdown';

export const AddCourseModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addCourse } = useApp();

  const [name, setName] = useState('');
  const [type, setType] = useState<'TECHNICAL' | 'NON_TECHNICAL'>('TECHNICAL');
  const [durationMonths, setDurationMonths] = useState<number>(6);
  const [description, setDescription] = useState('');
  const [moduleInput, setModuleInput] = useState('');
  const [modules, setModules] = useState<string[]>(['HTML', 'CSS', 'JavaScript', 'React']);

  const addModuleTag = () => {
    if (moduleInput.trim() && !modules.includes(moduleInput.trim())) {
      setModules([...modules, moduleInput.trim()]);
      setModuleInput('');
    }
  };

  const removeModuleTag = (tag: string) => {
    setModules(modules.filter(m => m !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || durationMonths <= 0) return;

    addCourse({
      name,
      type,
      durationMonths,
      description: description || 'Course curriculum and practical milestones.',
      modules
    });

    onClose();
  };

  const typeOptions = [
    { value: 'TECHNICAL', label: 'Technical Program' },
    { value: 'NON_TECHNICAL', label: 'Non-Technical Program' },
  ];

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
              Create New Course
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Specify duration in whole months and add modular topics
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
          {/* Course Name */}
          <div>
            <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
              Course Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Artificial Intelligence & Machine Learning"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-sm font-medium outline-none focus:border-[#FF5B26] text-[#141619] dark:text-white"
            />
          </div>

          {/* Type & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300 block mb-1">
                Course Classification *
              </label>
              <CustomDropdown
                value={type}
                onChange={(val) => setType(val as any)}
                options={typeOptions}
                placeholder="Select Classification"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300 block mb-1">
                Duration (Whole Months) *
              </label>
              <input
                type="number"
                min="1"
                max="36"
                required
                value={durationMonths}
                onChange={(e) => setDurationMonths(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-sm font-medium outline-none text-[#141619] dark:text-white font-mono"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Summary of course goals and learning outcomes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 px-4 py-2 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-sm font-medium outline-none focus:border-[#FF5B26] text-[#141619] dark:text-white resize-none"
            />
          </div>

          {/* Modules / Topics */}
          <div>
            <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
              Syllabus Modules / Topics (e.g. React, MongoDB)
            </label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                placeholder="Add topic (e.g. Next.js)..."
                value={moduleInput}
                onChange={(e) => setModuleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addModuleTag();
                  }
                }}
                className="flex-1 px-4 py-2 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-sm outline-none text-[#141619] dark:text-white"
              />
              <button
                type="button"
                onClick={addModuleTag}
                className="px-4 py-2 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-bold text-neutral-700 dark:text-neutral-200 transition-colors cursor-pointer"
              >
                Add Topic
              </button>
            </div>

            {/* Tags Cloud */}
            <div className="flex flex-wrap gap-2 mt-2.5">
              {modules.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-50 dark:bg-orange-950/30 text-[#FF5B26] text-xs font-semibold border border-orange-100 dark:border-orange-900/40"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeModuleTag(tag)}
                    className="hover:text-red-600 transition-colors cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
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
              Create Course
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

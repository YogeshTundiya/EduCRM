import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface CustomDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Select date',
  minDate,
  maxDate,
  className = '',
  size = 'md'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Parse current selected or fallback to today
  const selectedDate = value ? new Date(value + 'T00:00:00') : null;
  const initialDate = selectedDate || new Date();

  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());

  // Close on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isOpen]);

  // Navigate months
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  // Days calculations
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const formatDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSelectDay = (day: number) => {
    const mm = String(currentMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const formatted = `${currentYear}-${mm}-${dd}`;
    onChange(formatted);
    setIsOpen(false);
  };

  const handleToday = () => {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const formatted = `${today.getFullYear()}-${mm}-${dd}`;
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    onChange(formatted);
    setIsOpen(false);
  };

  const today = new Date();
  const isTodayMonth = today.getFullYear() === currentYear && today.getMonth() === currentMonth;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-xs sm:text-sm',
    lg: 'px-5 py-3.5 text-sm'
  };

  return (
    <div ref={containerRef} className={`relative inline-block w-full ${className}`}>
      {label && (
        <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300 block mb-1">
          {label}
        </label>
      )}
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full rounded-full border border-neutral-200/90 dark:border-neutral-800 bg-neutral-50/80 dark:bg-[#1A1D23] hover:bg-white dark:hover:bg-[#20242B] text-left flex items-center justify-between gap-2.5 transition-all outline-none focus:border-[#FF5B26] focus:ring-2 focus:ring-[#FF5B26]/10 ${
          sizeClasses[size]
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <CalendarIcon className="w-4 h-4 text-[#FF5B26] flex-shrink-0" />
          {value ? (
            <span className="font-medium text-[#141619] dark:text-white truncate">
              {formatDisplay(value)}
            </span>
          ) : (
            <span className="text-neutral-400 truncate">{placeholder}</span>
          )}
        </div>

        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-neutral-200/60 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
          {value || 'Date'}
        </span>
      </button>

      {/* Calendar Popup Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-50 left-0 mt-2 w-[290px] bg-white dark:bg-[#1A1D23] rounded-[24px] border border-black/[0.08] dark:border-white/[0.1] shadow-2xl p-4 backdrop-blur-xl"
          >
            {/* Header: Month & Year with Prev/Next buttons */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="w-7 h-7 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="text-xs font-bold text-[#141619] dark:text-white">
                {MONTHS[currentMonth]} {currentYear}
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="w-7 h-7 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Weekday Names Header */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
              {DAYS_OF_WEEK.map((d) => (
                <span key={d} className="text-[10px] font-bold text-neutral-400">
                  {d}
                </span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {/* Previous month padding days */}
              {Array.from({ length: firstDayOfWeek }).map((_, i) => {
                const dayNum = daysInPrevMonth - firstDayOfWeek + i + 1;
                return (
                  <span
                    key={`prev-${i}`}
                    className="w-8 h-8 flex items-center justify-center text-xs text-neutral-300 dark:text-neutral-600 select-none"
                  >
                    {dayNum}
                  </span>
                );
              })}

              {/* Current month days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const mm = String(currentMonth + 1).padStart(2, '0');
                const dd = String(dayNum).padStart(2, '0');
                const dateString = `${currentYear}-${mm}-${dd}`;
                const isSelected = value === dateString;
                const isCurrentToday = isTodayMonth && today.getDate() === dayNum;

                return (
                  <button
                    key={`day-${dayNum}`}
                    type="button"
                    onClick={() => handleSelectDay(dayNum)}
                    className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#FF5B26] text-white font-bold shadow-[0_2px_8px_rgba(255,91,38,0.4)]'
                        : isCurrentToday
                        ? 'border border-[#FF5B26] text-[#FF5B26] hover:bg-orange-50 dark:hover:bg-orange-950/30'
                        : 'text-[#141619] dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {dayNum}
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <button
                type="button"
                onClick={handleToday}
                className="text-[11px] font-bold text-[#FF5B26] hover:underline"
              >
                Today
              </button>

              {value && (
                <button
                  type="button"
                  onClick={() => {
                    onChange('');
                    setIsOpen(false);
                  }}
                  className="text-[11px] text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

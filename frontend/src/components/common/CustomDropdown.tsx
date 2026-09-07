import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Search } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  searchable?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select option',
  icon,
  className = '',
  disabled = false,
  searchable = false,
  size = 'md'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const filteredOptions = searchable && search.trim()
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase()) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(search.toLowerCase()))
      )
    : options;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-xs sm:text-sm',
    lg: 'px-5 py-3.5 text-sm'
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block w-full ${className}`}>
      {label && (
        <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300 block mb-1">
          {label}
        </label>
      )}
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full rounded-full border border-neutral-200/90 dark:border-neutral-800 bg-neutral-50/80 dark:bg-[#1A1D23] hover:bg-white dark:hover:bg-[#20242B] text-left flex items-center justify-between gap-2.5 transition-all outline-none focus:border-[#FF5B26] focus:ring-2 focus:ring-[#FF5B26]/10 disabled:opacity-50 disabled:cursor-not-allowed ${
          sizeClasses[size]
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {icon && <span className="text-neutral-400 flex-shrink-0">{icon}</span>}
          {selectedOption ? (
            <span className="font-medium text-[#141619] dark:text-white truncate">
              {selectedOption.label}
            </span>
          ) : (
            <span className="text-neutral-400 truncate">{placeholder}</span>
          )}
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-neutral-400 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#FF5B26]' : ''
          }`}
        />
      </button>

      {/* Animated Dropdown Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-50 left-0 right-0 mt-2 min-w-[200px] max-h-64 overflow-y-auto bg-white dark:bg-[#1A1D23] rounded-2xl border border-black/[0.08] dark:border-white/[0.1] shadow-2xl p-1.5 backdrop-blur-xl"
          >
            {/* Search filter if enabled or many options */}
            {(searchable || options.length > 6) && (
              <div className="p-1.5 border-b border-neutral-100 dark:border-neutral-800 mb-1">
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs text-[#141619] dark:text-white outline-none placeholder:text-neutral-400"
                  />
                </div>
              </div>
            )}

            {/* Options List */}
            <div className="space-y-0.5">
              {filteredOptions.length === 0 ? (
                <div className="py-3 text-center text-xs text-neutral-400 font-medium">
                  No matching options
                </div>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onChange(opt.value);
                        setIsOpen(false);
                        setSearch('');
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between gap-2 text-xs transition-colors ${
                        isSelected
                          ? 'bg-[#FF5B26]/10 text-[#FF5B26] font-bold'
                          : 'text-[#141619] dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/70 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {opt.icon && <span className="flex-shrink-0">{opt.icon}</span>}
                        <div className="truncate">
                          <p className="truncate">{opt.label}</p>
                          {opt.sublabel && (
                            <p className="text-[10px] text-neutral-400 truncate font-normal">
                              {opt.sublabel}
                            </p>
                          )}
                        </div>
                      </div>

                      {isSelected && <Check className="w-3.5 h-3.5 text-[#FF5B26] flex-shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

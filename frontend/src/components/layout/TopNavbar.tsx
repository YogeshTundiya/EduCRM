import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Info, ChevronDown, Check, Sparkles, BookOpen, Users, Calendar, Trash2, Settings } from 'lucide-react';
import { useApp, NavTab } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const TopNavbar: React.FC = () => {
  const { activeTab, setActiveTab, showToast, isDarkMode, trashedStudents, trashedCourses } = useApp();
  const { user, logout } = useAuth();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const tabs: NavTab[] = ['Overview', 'Students', 'Courses', 'Professors', 'Attendance', 'Trash', 'Settings'];
  const totalTrashed = trashedStudents.length + trashedCourses.length;

  return (
    <>
      <header className="w-full flex items-center justify-between py-4 px-2 select-none">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.05 }}
            className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FF5B26] to-[#FF8154] flex items-center justify-center shadow-[0_4px_16px_rgba(255,91,38,0.35)]"
          >
            {/* Minimalist modern geometric flame / logo mark from screenshot */}
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7" />
              <path d="M17 17V7H7" />
            </svg>
          </motion.div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-[#141619] dark:text-white flex items-center gap-1.5">
              Technoglobe
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#FF5B26]/10 text-[#FF5B26]">PRO</span>
            </span>
          </div>
        </div>

        {/* Center: Floating Navigation Pills */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/80 dark:bg-[#141619]/80 backdrop-blur-md p-1.5 rounded-full border border-black/[0.04] dark:border-white/[0.08] shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-2 rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? 'text-white'
                    : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="top-navbar-pill"
                    className="absolute inset-0 bg-[#141619] dark:bg-white rounded-full shadow-sm"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className={`relative z-10 flex items-center gap-1.5 ${isActive ? 'text-white dark:text-[#141619]' : ''}`}>
                  {tab === 'Trash' && <Trash2 className="w-3.5 h-3.5" />}
                  {tab === 'Settings' && <Settings className="w-3.5 h-3.5" />}
                  {tab}
                  {tab === 'Trash' && totalTrashed > 0 && (
                    <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {totalTrashed}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right: Tools & Profile */}
        <div className="flex items-center gap-2.5">
          {/* Search Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSearchModal(true)}
            className="w-10 h-10 rounded-full bg-white dark:bg-[#141619] border border-black/[0.04] dark:border-white/[0.08] shadow-sm flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-[#141619] dark:hover:text-white transition-colors cursor-pointer"
            title="Quick Search (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </motion.button>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => showToast('System is operating nominally')}
            className="w-10 h-10 rounded-full bg-white dark:bg-[#141619] border border-black/[0.04] dark:border-white/[0.08] shadow-sm flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-[#141619] dark:hover:text-white transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF5B26] ring-2 ring-white dark:ring-[#141619]" />
          </motion.button>

          {/* Info Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => showToast('System status: Online and synced')}
            className="w-10 h-10 rounded-full bg-white dark:bg-[#141619] border border-black/[0.04] dark:border-white/[0.08] shadow-sm flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-[#141619] dark:hover:text-white transition-colors cursor-pointer"
            title="System Info"
          >
            <Info className="w-4 h-4" />
          </motion.button>

          {/* User Profile Pill */}
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 pl-1.5 pr-3 py-1.5 rounded-full bg-white dark:bg-[#141619] border border-black/[0.04] dark:border-white/[0.08] shadow-sm cursor-pointer"
            >
              <img
                src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                alt={user?.name || "User"}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-black/10"
              />
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-xs font-bold text-[#141619] dark:text-white">
                  {user?.name || "Sajibur Rahman"}
                </span>
                <span className="text-[11px] text-neutral-400 font-normal truncate max-w-[120px]">
                  {user?.email || "admin@technoglobe.com"}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 ml-1" />
            </motion.div>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1A1D22] rounded-2xl shadow-xl border border-black/[0.06] dark:border-white/[0.08] p-2 z-50"
                >
                  <div className="p-3 border-b border-neutral-100 dark:border-neutral-800">
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Role</p>
                    <p className="text-sm font-bold text-[#141619] dark:text-white mt-0.5">
                      {user?.role === 'STAFF' ? 'Academic Staff' : 'Administrator'}
                    </p>
                    <p className="text-xs text-neutral-400 font-mono mt-0.5">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => { setActiveTab('Overview'); setShowProfileMenu(false); }}
                      className="w-full text-left px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 rounded-xl transition-colors cursor-pointer"
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => { setActiveTab('Students'); setShowProfileMenu(false); }}
                      className="w-full text-left px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 rounded-xl transition-colors cursor-pointer"
                    >
                      Students
                    </button>
                    <button
                      onClick={() => { setActiveTab('Settings'); setShowProfileMenu(false); }}
                      className="w-full text-left px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 rounded-xl transition-colors cursor-pointer"
                    >
                      Settings
                    </button>
                    <button
                      onClick={() => { setActiveTab('Trash'); setShowProfileMenu(false); }}
                      className="w-full text-left px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 rounded-xl transition-colors cursor-pointer"
                    >
                      Recycle Bin ({totalTrashed})
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        showToast('Signed out');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors font-medium flex items-center justify-between cursor-pointer"
                    >
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Global Quick Search Modal */}
      <AnimatePresence>
        {showSearchModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="bg-white dark:bg-[#1A1D22] w-full max-w-xl rounded-3xl p-6 shadow-2xl border border-black/[0.05] dark:border-white/[0.08]"
            >
              <div className="flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                <Search className="w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search students, courses, professors, settings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-base font-medium outline-none text-[#141619] dark:text-white placeholder:text-neutral-400"
                />
                <button
                  onClick={() => setShowSearchModal(false)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-neutral-800 cursor-pointer"
                >
                  ESC
                </button>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider px-2">Quick Navigation</p>
                <button
                  onClick={() => { setActiveTab('Students'); setShowSearchModal(false); }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-[#FF5B26] flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#141619] dark:text-white">Student Management</p>
                      <p className="text-xs text-neutral-400">View roster, enroll students, check end dates</p>
                    </div>
                  </div>
                  <span className="text-xs text-neutral-400 font-mono">Jump →</span>
                </button>

                <button
                  onClick={() => { setActiveTab('Courses'); setShowSearchModal(false); }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#141619] dark:text-white">Courses & Syllabi</p>
                      <p className="text-xs text-neutral-400">Technical / Non-Technical modules catalog</p>
                    </div>
                  </div>
                  <span className="text-xs text-neutral-400 font-mono">Jump →</span>
                </button>

                <button
                  onClick={() => { setActiveTab('Trash'); setShowSearchModal(false); }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center">
                      <Trash2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#141619] dark:text-white">Recycle Bin & Trash</p>
                      <p className="text-xs text-neutral-400">Restore or permanently purge deleted items ({totalTrashed})</p>
                    </div>
                  </div>
                  <span className="text-xs text-neutral-400 font-mono">Jump →</span>
                </button>

                <button
                  onClick={() => { setActiveTab('Settings'); setShowSearchModal(false); }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#141619] dark:text-white">System Settings</p>
                      <p className="text-xs text-neutral-400">Institute profile, academic rules, cursor, backup</p>
                    </div>
                  </div>
                  <span className="text-xs text-neutral-400 font-mono">Jump →</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

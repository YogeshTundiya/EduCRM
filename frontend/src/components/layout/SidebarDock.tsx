import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarDays,
  Mail,
  GraduationCap,
  Users,
  BookOpen,
  Settings,
  HelpCircle,
  LogOut,
  Sun,
  Moon,
  Trash2
} from 'lucide-react';
import { useApp, NavTab } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const SidebarDock: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    isDarkMode, 
    toggleDarkMode, 
    showToast,
    trashedStudents,
    trashedCourses
  } = useApp();
  const { logout } = useAuth();

  const totalTrashed = trashedStudents.length + trashedCourses.length;

  const navItems: { id: NavTab; icon: React.ElementType; label: string }[] = [
    { id: 'Overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'Attendance', icon: CalendarDays, label: 'Attendance' },
    { id: 'Students', icon: Users, label: 'Students' },
    { id: 'Courses', icon: BookOpen, label: 'Courses' },
    { id: 'Professors', icon: GraduationCap, label: 'Professors' },
  ];

  return (
    <aside className="fixed left-5 top-6 bottom-6 w-[72px] z-30 flex flex-col justify-between items-center py-5 bg-white/90 dark:bg-[#141619]/90 backdrop-blur-xl rounded-[28px] border border-black/[0.04] dark:border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-colors duration-300">
      {/* Top: Theme Toggle */}
      <div className="flex flex-col items-center gap-2">
        <div className="p-1 rounded-2xl bg-black/[0.03] dark:bg-white/[0.06] flex flex-col items-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
              !isDarkMode 
                ? 'text-[#FF5B26] bg-white shadow-sm' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sun className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
              isDarkMode 
                ? 'text-[#FF5B26] bg-[#22252A] shadow-sm' 
                : 'text-neutral-400 hover:text-neutral-900'
            }`}
          >
            <Moon className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Center: Main App Nav Icons */}
      <div className="flex flex-col items-center gap-2.5">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <div key={item.id} className="relative group">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setActiveTab(item.id)}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 relative cursor-pointer ${
                  isActive
                    ? 'bg-[#141619] text-white shadow-md dark:bg-white dark:text-[#141619]'
                    : 'text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04]'
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                {isActive && (
                  <motion.div
                    layoutId="active-dock-indicator"
                    className="absolute -right-1.5 w-1 h-3 rounded-full bg-[#FF5B26]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>

              {/* Tooltip on hover */}
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-[#141619] text-white text-xs font-medium opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg z-50">
                {item.label}
              </div>
            </div>
          );
        })}

        {/* Separator */}
        <div className="w-8 h-[1px] bg-neutral-200/60 dark:bg-neutral-800 my-1" />

        {/* Trash Page Button with Badge */}
        <div className="relative group">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setActiveTab('Trash')}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 relative cursor-pointer ${
              activeTab === 'Trash'
                ? 'bg-red-500 text-white shadow-md'
                : 'text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30'
            }`}
            title="Recycle Bin & Trash"
          >
            <Trash2 className="w-5 h-5" />
            {totalTrashed > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                {totalTrashed > 9 ? '9+' : totalTrashed}
              </span>
            )}
            {activeTab === 'Trash' && (
              <motion.div
                layoutId="active-dock-indicator"
                className="absolute -right-1.5 w-1 h-3 rounded-full bg-red-500"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </motion.button>
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-[#141619] text-white text-xs font-medium opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg z-50">
            Trash ({totalTrashed})
          </div>
        </div>

        {/* Settings Button */}
        <div className="relative group">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setActiveTab('Settings')}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 relative cursor-pointer ${
              activeTab === 'Settings'
                ? 'bg-[#141619] text-white shadow-md dark:bg-white dark:text-[#141619]'
                : 'text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04]'
            }`}
            title="System Settings"
          >
            <Settings className="w-5 h-5" />
            {activeTab === 'Settings' && (
              <motion.div
                layoutId="active-dock-indicator"
                className="absolute -right-1.5 w-1 h-3 rounded-full bg-[#FF5B26]"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </motion.button>
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-[#141619] text-white text-xs font-medium opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg z-50">
            Settings
          </div>
        </div>
      </div>

      {/* Bottom: Help and Logout */}
      <div className="flex flex-col items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => showToast('Help & Documentation')}
          className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-800 dark:hover:text-white hover:bg-black/[0.04] transition-all cursor-pointer"
          title="Help & FAQ"
        >
          <HelpCircle className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => {
            logout();
            showToast('Signed out');
          }}
          className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </motion.button>
      </div>
    </aside>
  );
};

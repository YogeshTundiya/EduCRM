import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SidebarDock } from './components/layout/SidebarDock';
import { TopNavbar } from './components/layout/TopNavbar';
import { OverviewView } from './components/dashboard/OverviewView';
import { StudentsView } from './components/students/StudentsView';
import { CoursesView } from './components/courses/CoursesView';
import { ProfessorsView } from './components/professors/ProfessorsView';
import { AttendanceView } from './components/attendance/AttendanceView';
import { ReportsView } from './components/reports/ReportsView';
import { TrashView } from './components/trash/TrashView';
import { SettingsView } from './components/settings/SettingsView';
import { AuthPage } from './components/auth/AuthPage';
import { CustomCursor } from './components/common/CustomCursor';
import { useApp } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import { CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  const { activeTab, toastMessage } = useApp();
  const { isAuthenticated } = useAuth();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'Overview':
        return <OverviewView />;
      case 'Students':
        return <StudentsView />;
      case 'Courses':
        return <CoursesView />;
      case 'Professors':
        return <ProfessorsView />;
      case 'Attendance':
        return <AttendanceView />;
      case 'Reports':
        return <ReportsView />;
      case 'Trash':
        return <TrashView />;
      case 'Settings':
        return <SettingsView />;
      default:
        return <OverviewView />;
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <CustomCursor />
        <AuthPage />
        {/* Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#141619] text-white shadow-2xl border border-white/10 text-xs font-semibold"
            >
              <CheckCircle2 className="w-4 h-4 text-[#FF5B26]" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F5F8] dark:bg-[#0E1012] text-[#141619] dark:text-[#E8EAEF] transition-colors duration-300 relative flex">
      {/* Smooth Spring Custom Cursor */}
      <CustomCursor />

      {/* Floating Left Dock matching reference image */}
      <SidebarDock />

      {/* Main Content Area (Offset to account for floating dock with generous luxury spacing) */}
      <div className="flex-1 ml-[116px] sm:ml-[124px] lg:ml-[132px] mr-4 sm:mr-8 my-6 flex flex-col min-w-0">
        {/* Top Navbar */}
        <TopNavbar />

        {/* View Surface with smooth Framer Motion transition */}
        <main className="flex-1 mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#141619] text-white shadow-2xl border border-white/10 text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 text-[#FF5B26]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

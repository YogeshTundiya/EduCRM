import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Building2, 
  GraduationCap, 
  Sparkles, 
  ShieldCheck, 
  Database, 
  Save, 
  CheckCircle2, 
  Download, 
  Moon, 
  Sun, 
  MousePointer2, 
  KeyRound, 
  Clock, 
  Percent, 
  CalendarDays,
  RefreshCw,
  Info,
  Globe
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CustomDropdown } from '../common/CustomDropdown';

export const SettingsView: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    isCustomCursorEnabled, 
    toggleCustomCursor, 
    isDarkMode, 
    toggleDarkMode,
    students,
    courses,
    trashedStudents,
    trashedCourses
  } = useApp();

  const [activeSection, setActiveSection] = useState<'profile' | 'academic' | 'appearance' | 'security' | 'data'>('profile');
  const [formData, setFormData] = useState({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  
  // Security form states
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [securityMessage, setSecurityMessage] = useState<string | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSecurityMessage('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setSecurityMessage('Password must be at least 6 characters');
      return;
    }
    setSecurityMessage('Admin password updated successfully');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setSecurityMessage(null), 3000);
  };

  const handleExportData = () => {
    const exportPayload = {
      exportDate: new Date().toISOString(),
      institute: formData,
      students,
      courses,
      trashedStudents,
      trashedCourses,
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `institute_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const currencyOptions = [
    { value: '₹', label: 'INR (₹) - Indian Rupee' },
    { value: '$', label: 'USD ($) - US Dollar' },
    { value: '€', label: 'EUR (€) - Euro' },
    { value: '£', label: 'GBP (£) - British Pound' },
    { value: 'A$', label: 'AUD (A$) - Australian Dollar' },
    { value: 'C$', label: 'CAD (C$) - Canadian Dollar' },
  ];

  const timezoneOptions = [
    { value: 'Asia/Kolkata (IST)', label: 'Asia/Kolkata (IST, UTC+5:30)' },
    { value: 'America/New_York (EST)', label: 'America/New_York (EST, UTC-5:00)' },
    { value: 'America/Los_Angeles (PST)', label: 'America/Los_Angeles (PST, UTC-8:00)' },
    { value: 'Europe/London (GMT)', label: 'Europe/London (GMT, UTC+0:00)' },
    { value: 'Europe/Berlin (CET)', label: 'Europe/Berlin (CET, UTC+1:00)' },
    { value: 'Asia/Dubai (GST)', label: 'Asia/Dubai (GST, UTC+4:00)' },
    { value: 'Asia/Singapore (SGT)', label: 'Asia/Singapore (SGT, UTC+8:00)' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      <AnimatePresence>
        {savedSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-2xl border border-zinc-700/20 font-medium text-sm"
          >
            <CheckCircle2 className="w-5 h-5 text-brand" />
            <span>Settings saved and applied successfully.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1D22] border border-black/[0.04] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand/10 dark:bg-brand/20 flex items-center justify-center text-brand border border-brand/20">
            <SettingsIcon className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
              System Settings & Preferences
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              Manage institute branding, operational thresholds, appearance, and administrative controls.
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-5 py-2.5 rounded-2xl bg-brand text-white font-semibold text-sm hover:opacity-95 shadow-lg shadow-brand/25 transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      {/* Main Grid: Sidebar Navigation + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Tabs */}
        <div className="lg:col-span-1 space-y-1.5 p-2 rounded-3xl bg-white dark:bg-[#1A1D22] border border-black/[0.04] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] h-fit">
          <button
            onClick={() => setActiveSection('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer text-left ${
              activeSection === 'profile'
                ? 'bg-brand/10 dark:bg-brand/20 text-brand border border-brand/20'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
            }`}
          >
            <Building2 className="w-4 h-4 shrink-0" />
            <span>Institute Profile</span>
          </button>

          <button
            onClick={() => setActiveSection('academic')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer text-left ${
              activeSection === 'academic'
                ? 'bg-brand/10 dark:bg-brand/20 text-brand border border-brand/20'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
            }`}
          >
            <GraduationCap className="w-4 h-4 shrink-0" />
            <span>Academic Rules</span>
          </button>

          <button
            onClick={() => setActiveSection('appearance')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer text-left ${
              activeSection === 'appearance'
                ? 'bg-brand/10 dark:bg-brand/20 text-brand border border-brand/20'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Appearance & Cursor</span>
          </button>

          <button
            onClick={() => setActiveSection('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer text-left ${
              activeSection === 'security'
                ? 'bg-brand/10 dark:bg-brand/20 text-brand border border-brand/20'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Admin Security</span>
          </button>

          <button
            onClick={() => setActiveSection('data')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer text-left ${
              activeSection === 'data'
                ? 'bg-brand/10 dark:bg-brand/20 text-brand border border-brand/20'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
            }`}
          >
            <Database className="w-4 h-4 shrink-0" />
            <span>Data & Backup</span>
          </button>
        </div>

        {/* Form Content Panel */}
        <div className="lg:col-span-3">
          <div className="p-7 rounded-3xl bg-white dark:bg-[#1A1D22] border border-black/[0.04] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
            {/* SECTION 1: Profile */}
            {activeSection === 'profile' && (
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Institute Identity</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Official organization name and contact information displayed across reports.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Institute / Academy Name
                    </label>
                    <input
                      type="text"
                      value={formData.instituteName}
                      onChange={(e) => setFormData({ ...formData, instituteName: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-2xl bg-zinc-50 dark:bg-[#1E2024] border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Motto / Tagline
                    </label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-2xl bg-zinc-50 dark:bg-[#1E2024] border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Support Email
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-2xl bg-zinc-50 dark:bg-[#1E2024] border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Contact Phone / Hotline
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-2xl bg-zinc-50 dark:bg-[#1E2024] border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                      System Currency Symbol
                    </label>
                    <CustomDropdown
                      value={formData.currencySymbol}
                      onChange={(val) => setFormData({ ...formData, currencySymbol: val })}
                      options={currencyOptions}
                      placeholder="Select Currency"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                      Operational Timezone
                    </label>
                    <CustomDropdown
                      value={formData.timezone}
                      onChange={(val) => setFormData({ ...formData, timezone: val })}
                      options={timezoneOptions}
                      placeholder="Select Timezone"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-2xl bg-brand text-white font-semibold text-sm hover:opacity-95 shadow-md shadow-brand/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    Save Identity
                  </button>
                </div>
              </form>
            )}

            {/* SECTION 2: Academic Rules */}
            {activeSection === 'academic' && (
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Academic & Attendance Rules</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Configure institutional thresholds for student attendance flags and default durations.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5 p-5 rounded-2xl bg-zinc-50 dark:bg-[#1E2024] border border-zinc-200/80 dark:border-zinc-700/80">
                    <div className="flex items-center gap-2 text-brand mb-1">
                      <Percent className="w-4 h-4" />
                      <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        Min. Attendance Threshold
                      </label>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-2">
                      Students falling below this percentage are flagged as critical academic risk.
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="50"
                        max="100"
                        value={formData.minAttendanceThreshold}
                        onChange={(e) => setFormData({ ...formData, minAttendanceThreshold: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-sm font-semibold rounded-xl bg-white dark:bg-[#15171B] border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:border-brand"
                      />
                      <span className="text-sm font-bold text-zinc-500">%</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 p-5 rounded-2xl bg-zinc-50 dark:bg-[#1E2024] border border-zinc-200/80 dark:border-zinc-700/80">
                    <div className="flex items-center gap-2 text-blue-500 mb-1">
                      <CalendarDays className="w-4 h-4" />
                      <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        Default Course Duration
                      </label>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-2">
                      Standard base duration in months for new curriculums and courses.
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="36"
                        value={formData.defaultDurationMonths}
                        onChange={(e) => setFormData({ ...formData, defaultDurationMonths: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-sm font-semibold rounded-xl bg-white dark:bg-[#15171B] border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:border-brand font-mono"
                      />
                      <span className="text-xs font-semibold text-zinc-500">Months</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-2xl bg-brand text-white font-semibold text-sm hover:opacity-95 shadow-md shadow-brand/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    Save Academic Rules
                  </button>
                </div>
              </form>
            )}

            {/* SECTION 3: Appearance & Cursor */}
            {activeSection === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Interface & Visual Experience</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Tailor interactive animations, cursor effects, and dashboard contrast modes.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Custom Animated Cursor Toggle */}
                  <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-[#1E2024] border border-zinc-200/80 dark:border-zinc-700/80 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-brand/10 dark:bg-brand/20 text-brand flex items-center justify-center shrink-0">
                        <MousePointer2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                          Custom Smooth Spring Cursor
                        </h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          Enables fluid physics-based dot-and-ring cursor tracking with reactive magnetic hover scale on clickable buttons.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={toggleCustomCursor}
                      className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isCustomCursorEnabled ? 'bg-brand' : 'bg-zinc-300 dark:bg-zinc-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          isCustomCursorEnabled ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Theme Mode Toggle */}
                  <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-[#1E2024] border border-zinc-200/80 dark:border-zinc-700/80 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                        {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                          Theme Appearance ({isDarkMode ? 'Dark Matte' : 'Light Clean'})
                        </h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          Switch between high-contrast dark palette (#0E1012) and sunlight bright canvas.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={toggleDarkMode}
                      className="px-4 py-2 rounded-xl text-xs font-bold border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all text-zinc-800 dark:text-zinc-200 cursor-pointer"
                    >
                      Switch to {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 4: Security */}
            {activeSection === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Admin Security & Credentials</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Update administrative login passphrase and review active session credentials.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-3">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>Default demo credentials: <strong>admin@educrm.com</strong> / <strong>admin123</strong></span>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Current Password
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input
                        type="password"
                        required
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl bg-zinc-50 dark:bg-[#1E2024] border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      placeholder="Minimum 6 characters"
                      className="w-full px-4 py-2.5 text-sm rounded-2xl bg-zinc-50 dark:bg-[#1E2024] border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      placeholder="Re-type new password"
                      className="w-full px-4 py-2.5 text-sm rounded-2xl bg-zinc-50 dark:bg-[#1E2024] border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                    />
                  </div>

                  {securityMessage && (
                    <p className={`text-xs font-semibold ${securityMessage.includes('successfully') ? 'text-emerald-500' : 'text-red-500'}`}>
                      {securityMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold text-sm hover:opacity-90 transition-all cursor-pointer"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            )}

            {/* SECTION 5: Data & Backup */}
            {activeSection === 'data' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Data Management & Backup</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Export complete database records, inspect storage footprints, or initialize fresh data.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#1E2024] border border-zinc-200/80 dark:border-zinc-700/80">
                    <span className="text-xs text-zinc-500">Active Students</span>
                    <h4 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">{students.length}</h4>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#1E2024] border border-zinc-200/80 dark:border-zinc-700/80">
                    <span className="text-xs text-zinc-500">Active Courses</span>
                    <h4 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">{courses.length}</h4>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#1E2024] border border-zinc-200/80 dark:border-zinc-700/80">
                    <span className="text-xs text-zinc-500">Recycled Items</span>
                    <h4 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">
                      {trashedStudents.length + trashedCourses.length}
                    </h4>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-50 dark:bg-[#1E2024] border border-zinc-200/80 dark:border-zinc-700/80">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                        Export Full Institution Snapshot
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Download a verified JSON package containing all students, courses, attendance marks, and configuration.
                      </p>
                    </div>

                    <button
                      onClick={handleExportData}
                      className="px-4 py-2.5 rounded-xl bg-brand text-white font-semibold text-xs flex items-center gap-2 hover:opacity-95 shadow-md shadow-brand/20 transition-all cursor-pointer shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      Download Backup (.json)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

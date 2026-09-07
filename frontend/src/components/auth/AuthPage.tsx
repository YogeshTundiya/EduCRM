import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Sun,
  Moon,
  Sparkles,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import sculptureImg from '../../assets/sculpture.jpg';

export const AuthPage: React.FC = () => {
  const { login, register, isLoading, getAdminCredentials } = useAuth();
  const { isDarkMode, toggleDarkMode, showToast } = useApp();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberLogin, setRememberLogin] = useState(true);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState<'ADMIN' | 'STAFF'>('ADMIN');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // 3D Tilt for Botanical Sculpture on Left
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 });
  const rotateX = useTransform(springY, [-150, 150], [6, -6]);
  const rotateY = useTransform(springX, [-150, 150], [-6, 6]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // 1-Click Fast Fill with Confetti
  const handleQuickFillAdmin = () => {
    const creds = getAdminCredentials();
    setLoginEmail(creds.email);
    setLoginPassword(creds.password);
    setError(null);

    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#FF5B26', '#FF7A45', '#FF9E79', '#141619']
    });

    showToast('Admin credentials loaded');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!loginEmail.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!loginPassword) {
      setError('Please enter your password');
      return;
    }

    try {
      await login(loginEmail, loginPassword);
      showToast('Welcome back');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!regName.trim() || regName.trim().length < 2) {
      setError('Please enter your full name');
      return;
    }
    if (!regEmail.trim()) {
      setError('Please enter a valid email address');
      return;
    }
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register(regName, regEmail, regPassword, regRole);
      showToast('Account created successfully');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F4F5F8] dark:bg-[#0E1012] text-[#141619] dark:text-[#E8EAEF] transition-colors duration-300 flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-[#FF5B26]/20 selection:text-[#FF5B26] relative">
      {/* Floating Theme Switcher */}
      <div className="fixed top-6 right-6 z-20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={toggleDarkMode}
          aria-label="Toggle theme"
          className="w-10 h-10 rounded-full bg-white dark:bg-[#1A1D23] shadow-md border border-black/[0.04] dark:border-white/[0.08] flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-[#FF5B26] transition-colors"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#FF5B26]" />}
        </motion.button>
      </div>

      {/* Main Luxury Modal Card matching reference design with dashboard coral palette */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[1020px] bg-white dark:bg-[#14161B] rounded-[36px] sm:rounded-[42px] p-5 sm:p-7 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.08)] dark:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.55)] border border-neutral-100/90 dark:border-white/[0.06] overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* ========================================================== */}
          {/* LEFT COLUMN: 3D BOTANICAL SCULPTURE ART PANEL              */}
          {/* ========================================================== */}
          <div className="lg:col-span-6 w-full flex items-center justify-center">
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="w-full aspect-[3/4] max-h-[640px] rounded-[28px] sm:rounded-[34px] overflow-hidden bg-[#E7E4DC] dark:bg-[#1B1D22] relative flex items-center justify-center shadow-inner cursor-grab active:cursor-grabbing select-none"
              style={{ perspective: 1000 }}
            >
              {/* Parallax Image Container */}
              <motion.div
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                className="w-full h-full relative"
              >
                <img
                  src={sculptureImg || '/assets/sculpture.jpg'}
                  alt="Botanical Sculpture"
                  className="w-full h-full object-cover object-center pointer-events-none"
                />

                {/* Subtle soft vignette matching the reference image studio backdrop */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/[0.04] via-transparent to-transparent pointer-events-none" />
              </motion.div>
            </div>
          </div>

          {/* ========================================================== */}
          {/* RIGHT COLUMN: ELEGANT MINIMAL LOGIN / REGISTER FORM        */}
          {/* ========================================================== */}
          <div className="lg:col-span-6 w-full flex flex-col justify-center px-2 sm:px-6 lg:px-4 py-3">
            {/* Brand Header */}
            <div className="flex flex-col items-center text-center mb-6">
              {/* Eight-petaled stylized floral insignia matching reference */}
              <div className="flex items-center gap-2 mb-3">
                <svg
                  className="w-6 h-6 text-[#FF5B26]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  {/* Stylized eight-petaled flower icon */}
                  <circle cx="12" cy="12" r="3.5" />
                  <ellipse cx="12" cy="5" rx="2" ry="3.5" />
                  <ellipse cx="12" cy="19" rx="2" ry="3.5" />
                  <ellipse cx="5" cy="12" rx="3.5" ry="2" />
                  <ellipse cx="19" cy="12" rx="3.5" ry="2" />
                  <ellipse cx="7.05" cy="7.05" rx="2" ry="3.5" transform="rotate(-45 7.05 7.05)" />
                  <ellipse cx="16.95" cy="16.95" rx="2" ry="3.5" transform="rotate(-45 16.95 16.95)" />
                  <ellipse cx="16.95" cy="7.05" rx="2" ry="3.5" transform="rotate(45 16.95 7.05)" />
                  <ellipse cx="7.05" cy="16.95" rx="2" ry="3.5" transform="rotate(45 7.05 16.95)" />
                </svg>
                <span className="font-semibold text-sm tracking-wide text-[#141619] dark:text-white">
                  EduCRM
                </span>
              </div>

              {/* Title & Subtitle */}
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141619] dark:text-white">
                {mode === 'LOGIN' ? 'Login to your account' : 'Create your account'}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-500 mt-1.5 font-normal">
                {mode === 'LOGIN'
                  ? 'Welcome back! Enter your details to log in to your account'
                  : 'Start managing courses, students, and attendance'}
              </p>
            </div>

            {/* Error Message Banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mb-4 p-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900/40 text-xs text-red-600 dark:text-red-400 text-center font-medium"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Forms */}
            <AnimatePresence mode="wait">
              {mode === 'LOGIN' ? (
                /* ================= LOGIN FORM ================= */
                <motion.form
                  key="login-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleLoginSubmit}
                  className="space-y-4"
                >
                  {/* Email Field */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 pl-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-5 py-3.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1A1D23] text-sm text-[#141619] dark:text-white placeholder:text-neutral-400 outline-none focus:border-[#FF5B26] focus:ring-2 focus:ring-[#FF5B26]/15 transition-all font-normal"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 pl-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter your Password"
                        className="w-full pl-5 pr-12 py-3.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1A1D23] text-sm text-[#141619] dark:text-white placeholder:text-neutral-400 outline-none focus:border-[#FF5B26] focus:ring-2 focus:ring-[#FF5B26]/15 transition-all font-normal"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Options: Remember login & Forgot Password */}
                  <div className="flex items-center justify-between text-xs px-1 pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-500 dark:text-neutral-400">
                      <input
                        type="checkbox"
                        checked={rememberLogin}
                        onChange={(e) => setRememberLogin(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-neutral-300 text-[#FF5B26] focus:ring-[#FF5B26] accent-[#FF5B26]"
                      />
                      <span>Remember login</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        handleQuickFillAdmin();
                      }}
                      className="text-[#FF5B26] dark:text-[#FF7A45] font-semibold hover:underline"
                    >
                      Forget Password?
                    </button>
                  </div>

                  {/* Primary CTA: Dashboard Coral Pill Button */}
                  <motion.button
                    whileHover={{ scale: 1.008 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3.5 rounded-full bg-[#FF5B26] hover:bg-[#EE4A15] active:bg-[#D43C0A] text-white text-sm font-semibold shadow-[0_6px_20px_rgba(255,91,38,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span>Login</span>
                    )}
                  </motion.button>

                  {/* Divider: Or continue with */}
                  <div className="relative flex items-center justify-center my-4">
                    <div className="border-t border-neutral-200 dark:border-neutral-800 w-full" />
                    <span className="bg-white dark:bg-[#14161B] px-3 text-[11px] font-normal text-neutral-400 whitespace-nowrap">
                      Or continue with
                    </span>
                    <div className="border-t border-neutral-200 dark:border-neutral-800 w-full" />
                  </div>

                  {/* Social Buttons */}
                  <div className="space-y-2.5">
                    {/* Apple Button */}
                    <button
                      type="button"
                      onClick={() => showToast('Apple Sign In available in enterprise configuration')}
                      className="w-full py-3 px-4 rounded-full bg-neutral-100 hover:bg-neutral-200/80 dark:bg-[#1E222A] dark:hover:bg-[#252A34] text-neutral-900 dark:text-white text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2.5"
                    >
                      <svg className="w-4 h-4 text-neutral-900 dark:text-white fill-current" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.58.67-.99 1.74-.85 2.78.99.08 2.02-.53 2.57-1.28" />
                      </svg>
                      <span>Sign in with Apple</span>
                    </button>

                    {/* Google Button */}
                    <button
                      type="button"
                      onClick={() => showToast('Google SSO available in enterprise configuration')}
                      className="w-full py-3 px-4 rounded-full bg-neutral-100 hover:bg-neutral-200/80 dark:bg-[#1E222A] dark:hover:bg-[#252A34] text-neutral-900 dark:text-white text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2.5"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.33 24 12 24z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                        />
                      </svg>
                      <span>Sign in with Google</span>
                    </button>

                    {/* Admin Pass 1-Click Fast Fill Pill */}
                    <button
                      type="button"
                      onClick={handleQuickFillAdmin}
                      className="w-full py-2.5 px-4 rounded-full border border-dashed border-[#FF5B26]/40 hover:border-[#FF5B26] bg-[#FF5B26]/[0.04] hover:bg-[#FF5B26]/[0.08] text-[#FF5B26] dark:text-[#FF8B5A] text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Auto-fill Admin Pass (admin@educrm.com)</span>
                    </button>
                  </div>

                  {/* Switch to Register */}
                  <div className="text-center pt-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <span>New here? </span>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('REGISTER');
                        setError(null);
                      }}
                      className="text-[#FF5B26] dark:text-[#FF7A45] font-semibold hover:underline"
                    >
                      Create account
                    </button>
                  </div>
                </motion.form>
              ) : (
                /* ================= REGISTER FORM ================= */
                <motion.form
                  key="register-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleRegisterSubmit}
                  className="space-y-3.5"
                >
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 pl-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-5 py-3 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1A1D23] text-sm text-[#141619] dark:text-white placeholder:text-neutral-400 outline-none focus:border-[#FF5B26] focus:ring-2 focus:ring-[#FF5B26]/15 transition-all font-normal"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 pl-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-5 py-3 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1A1D23] text-sm text-[#141619] dark:text-white placeholder:text-neutral-400 outline-none focus:border-[#FF5B26] focus:ring-2 focus:ring-[#FF5B26]/15 transition-all font-normal"
                    />
                  </div>

                  {/* Role Selector */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 pl-1">
                      Designated Role
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRegRole('ADMIN')}
                        className={`py-2 px-3 rounded-full border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          regRole === 'ADMIN'
                            ? 'border-[#FF5B26] bg-[#FF5B26]/10 text-[#FF5B26]'
                            : 'border-neutral-200 dark:border-neutral-800 text-neutral-500'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Administrator</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRegRole('STAFF')}
                        className={`py-2 px-3 rounded-full border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          regRole === 'STAFF'
                            ? 'border-[#FF5B26] bg-[#FF5B26]/10 text-[#FF5B26]'
                            : 'border-neutral-200 dark:border-neutral-800 text-neutral-500'
                        }`}
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Faculty Staff</span>
                      </button>
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 pl-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Create a password"
                        className="w-full pl-5 pr-12 py-3 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1A1D23] text-sm text-[#141619] dark:text-white placeholder:text-neutral-400 outline-none focus:border-[#FF5B26] focus:ring-2 focus:ring-[#FF5B26]/15 transition-all font-normal"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 pl-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full px-5 py-3 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1A1D23] text-sm text-[#141619] dark:text-white placeholder:text-neutral-400 outline-none focus:border-[#FF5B26] focus:ring-2 focus:ring-[#FF5B26]/15 transition-all font-normal"
                    />
                  </div>

                  {/* Register Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.008 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3.5 rounded-full bg-[#FF5B26] hover:bg-[#EE4A15] active:bg-[#D43C0A] text-white text-sm font-semibold shadow-[0_6px_20px_rgba(255,91,38,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span>Create account</span>
                    )}
                  </motion.button>

                  {/* Switch to Login */}
                  <div className="text-center pt-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <span>Already have an account? </span>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('LOGIN');
                        setError(null);
                      }}
                      className="text-[#FF5B26] dark:text-[#FF7A45] font-semibold hover:underline"
                    >
                      Sign in
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

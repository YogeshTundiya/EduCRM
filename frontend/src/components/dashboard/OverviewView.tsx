import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BalanceCard } from './BalanceCard';
import { MetricGrid } from './MetricGrid';
import { IncomeBarChart } from './IncomeBarChart';
import { RecentActivityTable } from './RecentActivityTable';
import { EnrollStudentModal } from '../students/EnrollStudentModal';
import { useAuth } from '../../context/AuthContext';

export const OverviewView: React.FC = () => {
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const { user } = useAuth();
  const firstName = user?.name ? user.name.split(' ')[0] : 'Admin';

  return (
    <div className="flex flex-col gap-6">
      {/* Greeting Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-1"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#141619] dark:text-white">
          Good morning, {firstName}
        </h1>
        <p className="text-sm text-neutral-400 font-normal">
          Here is your institute overview and current student activity.
        </p>
      </motion.div>

      {/* Main Grid matching reference image layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column (Total Balance, Wallets, Spending Limit, Cards) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="xl:col-span-4 flex flex-col gap-6"
        >
          <BalanceCard onOpenEnroll={() => setShowEnrollModal(true)} />
        </motion.div>

        {/* Right Columns (Metrics, Chart, Activities Table) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="xl:col-span-8 flex flex-col gap-6"
        >
          {/* Top Row: 4 Bento Cards + Total Income Recharts Bar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 4 Stat Cards */}
            <div className="lg:col-span-7">
              <MetricGrid />
            </div>

            {/* Total Income Bar Chart */}
            <div className="lg:col-span-5">
              <IncomeBarChart />
            </div>
          </div>

          {/* Bottom Row: Full Width Recent Activities Data Table */}
          <RecentActivityTable />
        </motion.div>
      </div>

      {/* Enroll Student Modal */}
      {showEnrollModal && (
        <EnrollStudentModal onClose={() => setShowEnrollModal(false)} />
      )}
    </div>
  );
};

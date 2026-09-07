import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ShoppingBag, Coins, Landmark } from 'lucide-react';
import gsap from 'gsap';

export const MetricGrid: React.FC = () => {
  const earningsRef = useRef<HTMLHeadingElement>(null);
  const spendingRef = useRef<HTMLHeadingElement>(null);
  const incomeRef = useRef<HTMLHeadingElement>(null);
  const revenueRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // GSAP count-up tween
    const earningsObj = { val: 0 };
    const spendingObj = { val: 0 };
    const incomeObj = { val: 0 };
    const revenueObj = { val: 0 };

    gsap.to(earningsObj, {
      val: 950,
      duration: 1.4,
      ease: 'power2.out',
      onUpdate: () => {
        if (earningsRef.current) earningsRef.current.innerText = `₹${Math.round(earningsObj.val)}`;
      }
    });

    gsap.to(spendingObj, {
      val: 700,
      duration: 1.4,
      ease: 'power2.out',
      onUpdate: () => {
        if (spendingRef.current) spendingRef.current.innerText = `₹${Math.round(spendingObj.val)}`;
      }
    });

    gsap.to(incomeObj, {
      val: 1050,
      duration: 1.4,
      ease: 'power2.out',
      onUpdate: () => {
        if (incomeRef.current) incomeRef.current.innerText = `₹${Math.round(incomeObj.val).toLocaleString()}`;
      }
    });

    gsap.to(revenueObj, {
      val: 850,
      duration: 1.4,
      ease: 'power2.out',
      onUpdate: () => {
        if (revenueRef.current) revenueRef.current.innerText = `₹${Math.round(revenueObj.val)}`;
      }
    });
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
      {/* 1. Total Earnings (Coral Highlight Card) */}
      <motion.div
        whileHover={{ y: -3, scale: 1.01 }}
        className="rounded-[28px] p-6 bg-gradient-to-br from-[#FF5B26] to-[#F14B15] text-white shadow-[0_8px_25px_rgba(255,91,38,0.25)] flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-white/90">Total Earnings</span>
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
            <Wallet className="w-4 h-4" />
          </div>
        </div>

        <div className="my-3">
          <h3 ref={earningsRef} className="text-3xl font-extrabold tracking-tight">
            ₹950
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-medium text-white/90">
          <span className="font-bold">↑ 7%</span>
          <span>This month</span>
        </div>
      </motion.div>

      {/* 2. Total Spending */}
      <motion.div
        whileHover={{ y: -3, scale: 1.01 }}
        className="rounded-[28px] p-6 bg-white dark:bg-[#1A1D22] border border-black/[0.04] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Total Spending</span>
          <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>

        <div className="my-3">
          <h3 ref={spendingRef} className="text-3xl font-extrabold tracking-tight text-[#141619] dark:text-white">
            ₹700
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-medium text-red-500">
          <span className="font-bold">↓ 5%</span>
          <span className="text-neutral-400 font-normal">This month</span>
        </div>
      </motion.div>

      {/* 3. Total Income */}
      <motion.div
        whileHover={{ y: -3, scale: 1.01 }}
        className="rounded-[28px] p-6 bg-white dark:bg-[#1A1D22] border border-black/[0.04] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Total Income</span>
          <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300">
            <Coins className="w-4 h-4" />
          </div>
        </div>

        <div className="my-3">
          <h3 ref={incomeRef} className="text-3xl font-extrabold tracking-tight text-[#141619] dark:text-white">
            ₹1,050
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
          <span className="font-bold">↑ 8%</span>
          <span className="text-neutral-400 font-normal">This month</span>
        </div>
      </motion.div>

      {/* 4. Total Revenue */}
      <motion.div
        whileHover={{ y: -3, scale: 1.01 }}
        className="rounded-[28px] p-6 bg-white dark:bg-[#1A1D22] border border-black/[0.04] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Total Revenue</span>
          <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300">
            <Landmark className="w-4 h-4" />
          </div>
        </div>

        <div className="my-3">
          <h3 ref={revenueRef} className="text-3xl font-extrabold tracking-tight text-[#141619] dark:text-white">
            ₹850
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
          <span className="font-bold">↑ 4%</span>
          <span className="text-neutral-400 font-normal">This month</span>
        </div>
      </motion.div>
    </div>
  );
};

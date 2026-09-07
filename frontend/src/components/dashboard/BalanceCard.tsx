import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, ArrowDownLeft, MoreVertical, Plus, Wifi, Sparkles, CreditCard, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BalanceCard: React.FC<{ onOpenEnroll: () => void }> = ({ onOpenEnroll }) => {
  const { wallets, cards, showToast } = useApp();
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);

  return (
    <div className="bg-white dark:bg-[#1A1D22] rounded-[28px] p-6 border border-black/[0.04] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col gap-6">
      {/* Top Header: Total Balance & Currency */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Total Balance</span>
          <div className="flex items-baseline gap-3 mt-1">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#141619] dark:text-white">
              ₹6,89,372.00
            </h2>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 mt-2 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 text-xs font-semibold">
            <span>↑ 5%</span>
            <span className="text-neutral-500 font-normal">than last month</span>
          </div>
        </div>

        {/* Currency Selector Pill */}
        <div className="relative">
          <button 
            onClick={() => showToast('Currency switcher: INR selected')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-[#141619] dark:text-white hover:bg-neutral-200 transition-colors"
          >
            <span>🇮🇳 INR</span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
          </button>
        </div>
      </div>

      {/* Pill Buttons: Transfer & Request / Enroll */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowTransferModal(true)}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#141619] dark:bg-white text-white dark:text-[#141619] text-sm font-bold shadow-md hover:shadow-lg transition-all"
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Transfer</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenEnroll}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700 text-[#141619] dark:text-white text-sm font-bold hover:bg-neutral-100 transition-all"
        >
          <ArrowDownLeft className="w-4 h-4" />
          <span>Request / Enroll</span>
        </motion.button>
      </div>

      {/* Wallets Carousel / Row */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-[#141619] dark:text-white">
            Wallets <span className="text-neutral-400 font-normal">| Total 6 wallets</span>
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {wallets.map((w) => (
            <div
              key={w.id}
              className="p-3 rounded-2xl bg-[#F8F9FA] dark:bg-neutral-800/50 border border-black/[0.03] dark:border-white/[0.04] flex flex-col justify-between transition-all hover:bg-neutral-100/80 dark:hover:bg-neutral-800"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#141619] dark:text-white flex items-center gap-1">
                  <span>{w.flag}</span> {w.code}
                </span>
                <MoreVertical className="w-3.5 h-3.5 text-neutral-400 cursor-pointer" />
              </div>

              <div className="mt-2">
                <p className="text-sm font-extrabold text-[#141619] dark:text-white leading-tight">
                  {w.amount}
                </p>
                <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                  {w.limit}
                </p>
              </div>

              <div className="mt-2 flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${w.status === 'Active' ? 'bg-emerald-500' : 'bg-red-400'}`} />
                <span className={`text-[10px] font-semibold ${w.status === 'Active' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {w.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Spending Limit Progress */}
      <div className="flex flex-col gap-2 pt-1 border-t border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#141619] dark:text-white">Monthly Spending Limit</span>
        </div>

        {/* Pill Progress Bar */}
        <div className="w-full h-3.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden relative p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '25.4%' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full bg-[#FF5B26] shadow-sm"
          />
          {/* Subtle diagonal background hatch on remaining portion */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,#000_4px,#000_8px)]" />
        </div>

        <div className="flex items-center justify-between text-xs font-medium text-neutral-500">
          <span className="text-xs font-bold text-[#141619] dark:text-white">
            ₹1,40,000 <span className="font-normal text-neutral-400">spent out of</span>
          </span>
          <span className="text-neutral-400 font-semibold">₹5,50,000</span>
        </div>
      </div>

      {/* My Cards Section */}
      <div className="flex flex-col gap-3 pt-1 border-t border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[#141619] dark:text-white">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-[#141619] dark:text-white">My Cards</span>
          </div>
          <button
            onClick={() => setShowCardModal(true)}
            className="text-xs font-semibold text-neutral-500 hover:text-[#141619] dark:hover:text-white flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add new
          </button>
        </div>

        {/* Cards Row / Carousel */}
        <div className="grid grid-cols-2 gap-3">
          {/* Obsidian Mastercard Card */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="rounded-2xl p-4 bg-gradient-to-br from-[#1C1F24] to-[#121417] text-white shadow-lg relative overflow-hidden flex flex-col justify-between h-36 border border-white/10"
          >
            <div className="flex items-center justify-between relative z-10">
              <Wifi className="w-4 h-4 text-neutral-400 rotate-90" />
              <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold tracking-wider">
                Active
              </span>
            </div>

            {/* Subtle Mastercard Red & Yellow overlapping circles */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
              <div className="w-8 h-8 rounded-full bg-red-500/80 -mr-3" />
              <div className="w-8 h-8 rounded-full bg-amber-400/80" />
            </div>

            <div className="relative z-10 mt-auto">
              <p className="text-[10px] text-neutral-400 font-mono">Card Number</p>
              <p className="text-xs font-bold font-mono tracking-widest text-white mt-0.5">
                **** **** 6782
              </p>
              <div className="flex items-center justify-between text-[9px] text-neutral-400 mt-2 font-mono">
                <div>EXP <span className="text-white font-bold">09/29</span></div>
                <div>CVV <span className="text-white font-bold">611</span></div>
              </div>
            </div>
          </motion.div>

          {/* Orange Mastercard Card */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="rounded-2xl p-4 bg-gradient-to-br from-[#FF5B26] to-[#E34814] text-white shadow-lg relative overflow-hidden flex flex-col justify-between h-36"
          >
            <div className="flex items-center justify-between relative z-10">
              <Wifi className="w-4 h-4 text-white/80 rotate-90" />
              <span className="px-2 py-0.5 rounded-full bg-white/30 backdrop-blur-md text-[10px] font-bold tracking-wider">
                Active
              </span>
            </div>

            {/* Sparkles graphic */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="relative z-10 mt-auto">
              <p className="text-[10px] text-white/80 font-mono">Card Number</p>
              <p className="text-xs font-bold font-mono tracking-widest text-white mt-0.5">
                **** **** 4356
              </p>
              <div className="flex items-center justify-between text-[9px] text-white/80 mt-2 font-mono">
                <div>EXP <span className="text-white font-bold">11/30</span></div>
                <div>CVV <span className="text-white font-bold">942</span></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Transfer Quick Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#1A1D22] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-black/[0.05]"
          >
            <h3 className="text-lg font-bold text-[#141619] dark:text-white">Quick Transfer / Payout</h3>
            <p className="text-xs text-neutral-400 mt-1">Send funds or allocate student scholarship disbursements</p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-neutral-500">Recipient Account / Student</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Rivera or ACC-98234"
                  className="w-full mt-1 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-sm outline-none font-medium text-[#141619] dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-500">Amount (INR / ₹)</label>
                <input
                  type="number"
                  placeholder="₹ 5,000.00"
                  className="w-full mt-1 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-sm outline-none font-medium text-[#141619] dark:text-white"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowTransferModal(false)}
                className="px-4 py-2 rounded-full text-xs font-bold text-neutral-500 hover:text-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showToast('Transfer completed successfully!');
                  setShowTransferModal(false);
                }}
                className="px-5 py-2 rounded-full bg-[#FF5B26] text-white text-xs font-bold shadow-md hover:bg-[#EE4A15]"
              >
                Send Transfer
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Card Modal */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#1A1D22] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-black/[0.05]"
          >
            <h3 className="text-lg font-bold text-[#141619] dark:text-white">Add New Institute Card</h3>
            <p className="text-xs text-neutral-400 mt-1">Add a corporate or debit card for departmental expenses</p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-neutral-500">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="Institute Admin"
                  className="w-full mt-1 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-sm outline-none font-medium text-[#141619] dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-500">Card Number</label>
                <input
                  type="text"
                  placeholder="4000 1234 5678 9010"
                  className="w-full mt-1 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-sm outline-none font-medium text-[#141619] dark:text-white font-mono"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowCardModal(false)}
                className="px-4 py-2 rounded-full text-xs font-bold text-neutral-500 hover:text-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showToast('New card linked successfully!');
                  setShowCardModal(false);
                }}
                className="px-5 py-2 rounded-full bg-[#141619] text-white text-xs font-bold shadow-md hover:bg-black"
              >
                Save Card
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

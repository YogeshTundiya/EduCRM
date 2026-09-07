import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { CHART_DATA } from '../../data/mockData';

// Custom modern tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#141619] text-white p-3 rounded-2xl shadow-xl text-xs border border-white/10">
        <p className="font-bold mb-1 text-neutral-300">{label}</p>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5B26]" />
          <span>Profit / Tuition: <strong>₹{payload[0]?.value}k</strong></span>
        </div>
        {payload[1] && (
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-500" />
            <span>Loss / Expenses: <strong>₹{payload[1]?.value}k</strong></span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const IncomeBarChart: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#1A1D22] rounded-[28px] p-6 border border-black/[0.04] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between h-full">
      {/* Header & Legend */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#141619] dark:text-white">
            Total Income
          </h3>
        </div>
        <p className="text-xs text-neutral-400">
          View your income in a certain period of time
        </p>

        <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <span className="text-xs font-bold text-[#141619] dark:text-white">
            Profit and Loss
          </span>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2A6FF4]" />
              <span>Profit</span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#141619] dark:bg-white" />
              <span>Loss</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recharts Bar Chart */}
      <div className="w-full h-56 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={6}>
            <defs>
              {/* Diagonal stripe pattern matching the reference screenshot's orange/coral bar */}
              <pattern
                id="orangeDiagonalStripe"
                patternUnits="userSpaceOnUse"
                width="8"
                height="8"
                patternTransform="rotate(45)"
              >
                <line x1="0" y1="0" x2="0" y2="8" stroke="#FF5B26" strokeWidth="4" />
                <line x1="4" y1="0" x2="4" y2="8" stroke="#FF8154" strokeWidth="4" />
              </pattern>
            </defs>

            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 11 }}
              tickFormatter={(val) => `₹${val}k`}
              domain={[0, 50]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
            {/* Loss / Dark Bar */}
            <Bar
              dataKey="loss"
              fill="#141619"
              radius={[6, 6, 0, 0]}
              barSize={16}
            />
            {/* Profit / Orange Striped Bar */}
            <Bar
              dataKey="profit"
              fill="url(#orangeDiagonalStripe)"
              stroke="#FF5B26"
              strokeWidth={1}
              radius={[6, 6, 0, 0]}
              barSize={16}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

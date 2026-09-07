import React from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, Users, CheckCircle2, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReportsView: React.FC = () => {
  const { courses, students, attendance } = useApp();

  const enrollmentTrends = [
    { month: 'Jan', enrollments: 28, attendance: 92 },
    { month: 'Feb', enrollments: 34, attendance: 94 },
    { month: 'Mar', enrollments: 45, attendance: 91 },
    { month: 'Apr', enrollments: 52, attendance: 95 },
    { month: 'May', enrollments: 60, attendance: 96 },
    { month: 'Jun', enrollments: 68, attendance: 94 },
    { month: 'Jul', enrollments: 74, attendance: 97 },
    { month: 'Aug', enrollments: 82, attendance: 95 },
  ];

  const courseDistribution = courses.map(c => ({
    name: c.name.split(' ')[0] + ' ' + (c.name.split(' ')[1] || ''),
    students: students.filter(s => s.courseId === c.id).length || 10
  }));

  const COLORS = ['#FF5B26', '#141619', '#3B82F6', '#10B981', '#8B5CF6'];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#141619] dark:text-white">
          Institute Analytics & Reports
        </h1>
        <p className="text-sm text-neutral-400 font-normal mt-0.5">
          Student retention, monthly enrollment trajectories, and syllabus completion velocity
        </p>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1A1D22] p-5 rounded-[24px] border border-black/[0.04] dark:border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">Total Enrolled</span>
            <Users className="w-4 h-4 text-[#FF5B26]" />
          </div>
          <p className="text-2xl font-black text-[#141619] dark:text-white mt-2">184 Students</p>
          <span className="text-[11px] font-bold text-emerald-600">↑ 14% vs last quarter</span>
        </div>

        <div className="bg-white dark:bg-[#1A1D22] p-5 rounded-[24px] border border-black/[0.04] dark:border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">Avg. Attendance</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-[#141619] dark:text-white mt-2">94.6%</p>
          <span className="text-[11px] font-bold text-emerald-600">↑ 2.1% consistency</span>
        </div>

        <div className="bg-white dark:bg-[#1A1D22] p-5 rounded-[24px] border border-black/[0.04] dark:border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">Graduation Velocity</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-[#141619] dark:text-white mt-2">98.2%</p>
          <span className="text-[11px] font-bold text-purple-600">Zero dropouts this month</span>
        </div>

        <div className="bg-white dark:bg-[#1A1D22] p-5 rounded-[24px] border border-black/[0.04] dark:border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">Faculty Load</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-[#141619] dark:text-white mt-2">1:18 Ratio</p>
          <span className="text-[11px] font-bold text-blue-600">Optimal mentor bandwidth</span>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Enrollment Trajectory Line Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-[#1A1D22] p-6 rounded-[28px] border border-black/[0.04] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
          <h3 className="text-base font-bold text-[#141619] dark:text-white">
            Enrollment Growth & Attendance Trends (2026)
          </h3>
          <p className="text-xs text-neutral-400 mb-4">
            Monthly cohort expansion correlated with daily attendance adherence
          </p>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enrollmentTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.04)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#141619', borderRadius: '16px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="enrollments"
                  stroke="#FF5B26"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#FF5B26' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="#10B981"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#10B981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Enrollment Breakdown */}
        <div className="lg:col-span-4 bg-white dark:bg-[#1A1D22] p-6 rounded-[28px] border border-black/[0.04] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#141619] dark:text-white">
              Course Distribution
            </h3>
            <p className="text-xs text-neutral-400 mb-2">
              Share of student enrollments by discipline
            </p>

            <div className="w-full h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={courseDistribution}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="students"
                  >
                    {courseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#141619', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
            {courseDistribution.slice(0, 4).map((c, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-neutral-600 dark:text-neutral-300 font-medium truncate max-w-[140px]">{c.name}</span>
                </div>
                <span className="font-bold text-[#141619] dark:text-white font-mono">{c.students}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

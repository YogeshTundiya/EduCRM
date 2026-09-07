import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, MoreHorizontal, Check, Download, Eye, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActivityItem } from '../../types';

export const RecentActivityTable: React.FC = () => {
  const { activities, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>(['INV_000073']); // Default checked as in screenshot
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredActivities.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredActivities.map(a => a.id));
    }
  };

  const filteredActivities = activities.filter(a => {
    const matchesSearch = 
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.activity.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === 'ALL' || a.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Render branded icons matching reference image
  const renderIcon = (type: ActivityItem['icon']) => {
    switch (type) {
      case 'app':
        return (
          <div className="w-8 h-8 rounded-xl bg-[#007AFF] text-white flex items-center justify-center font-bold text-xs shadow-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.64 1.35-.57.65-.98 1.7-0.85 2.72.99.08 2.01-.52 2.57-1.22z"/>
            </svg>
          </div>
        );
      case 'hotel':
        return (
          <div className="w-8 h-8 rounded-xl bg-[#1E293B] text-white flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M3 21h18M6 18V7l6-4 6 4v11M10 9h4M10 13h4M10 17h4"/>
            </svg>
          </div>
        );
      case 'flight':
        return (
          <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z"/>
            </svg>
          </div>
        );
      case 'grocery':
        return (
          <div className="w-8 h-8 rounded-xl bg-[#FFC220] text-[#0071DC] flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a1.5 1.5 0 0 1 1.5 1.5V6a1.5 1.5 0 0 1-3 0V3.5A1.5 1.5 0 0 1 12 2zm0 14a1.5 1.5 0 0 1 1.5 1.5v2.5a1.5 1.5 0 0 1-3 0v-2.5A1.5 1.5 0 0 1 12 16zm-7-5a1.5 1.5 0 0 1 1.5-1.5H9a1.5 1.5 0 0 1 0 3H6.5A1.5 1.5 0 0 1 5 11zm10 0a1.5 1.5 0 0 1 1.5-1.5h2.5a1.5 1.5 0 0 1 0 3h-2.5A1.5 1.5 0 0 1 15 11z"/>
            </svg>
          </div>
        );
      case 'adobe':
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-[#EB1000] text-white flex items-center justify-center font-black text-xs shadow-sm">
            <span>A</span>
          </div>
        );
    }
  };

  const getStatusBadge = (status: ActivityItem['status']) => {
    switch (status) {
      case 'Completed':
        return (
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="text-xs font-semibold text-[#141619] dark:text-neutral-200">Completed</span>
          </div>
        );
      case 'Pending':
        return (
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
            <span className="text-xs font-semibold text-[#141619] dark:text-neutral-200">Pending</span>
          </div>
        );
      case 'In Progress':
        return (
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            <span className="text-xs font-semibold text-[#141619] dark:text-neutral-200">In Progress</span>
          </div>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-[#1A1D22] rounded-[28px] p-6 border border-black/[0.04] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col gap-5">
      {/* Header & Search/Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-[#141619] dark:text-white">
            Recent Activities
          </h3>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search Input Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-full bg-neutral-100/80 dark:bg-neutral-800 text-xs font-medium outline-none text-[#141619] dark:text-white placeholder:text-neutral-400 focus:ring-1 focus:ring-black/10 dark:focus:ring-white/10 transition-all"
            />
          </div>

          {/* Filter Button */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-100/80 dark:bg-neutral-800 hover:bg-neutral-200/80 text-xs font-semibold text-[#141619] dark:text-white transition-colors"
            >
              <span>Filter</span>
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#1E2127] rounded-2xl shadow-xl border border-black/[0.06] dark:border-white/[0.08] p-2 z-30 text-xs">
                <button
                  onClick={() => { setFilterStatus('ALL'); setShowFilterDropdown(false); }}
                  className={`w-full text-left px-3 py-2 rounded-xl ${filterStatus === 'ALL' ? 'bg-neutral-100 font-bold' : ''}`}
                >
                  All Statuses
                </button>
                <button
                  onClick={() => { setFilterStatus('Completed'); setShowFilterDropdown(false); }}
                  className={`w-full text-left px-3 py-2 rounded-xl ${filterStatus === 'Completed' ? 'bg-neutral-100 font-bold' : ''}`}
                >
                  Completed
                </button>
                <button
                  onClick={() => { setFilterStatus('Pending'); setShowFilterDropdown(false); }}
                  className={`w-full text-left px-3 py-2 rounded-xl ${filterStatus === 'Pending' ? 'bg-neutral-100 font-bold' : ''}`}
                >
                  Pending
                </button>
                <button
                  onClick={() => { setFilterStatus('In Progress'); setShowFilterDropdown(false); }}
                  className={`w-full text-left px-3 py-2 rounded-xl ${filterStatus === 'In Progress' ? 'bg-neutral-100 font-bold' : ''}`}
                >
                  In Progress
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-100 dark:border-neutral-800 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              <th className="py-3 px-3 w-10">
                <div 
                  onClick={toggleSelectAll}
                  className={`w-4 h-4 rounded border cursor-pointer flex items-center justify-center transition-colors ${
                    selectedIds.length === filteredActivities.length && filteredActivities.length > 0
                      ? 'bg-[#141619] border-[#141619] text-white dark:bg-white dark:border-white dark:text-[#141619]'
                      : 'border-neutral-300 dark:border-neutral-700'
                  }`}
                >
                  {selectedIds.length === filteredActivities.length && filteredActivities.length > 0 && (
                    <Check className="w-3 h-3 stroke-[3]" />
                  )}
                </div>
              </th>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Activity</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100/60 dark:divide-neutral-800/60 text-xs">
            {filteredActivities.map((act, index) => {
              const isSelected = selectedIds.includes(act.id);
              return (
                <tr
                  key={`${act.id}-${index}`}
                  className={`group transition-colors ${
                    isSelected ? 'bg-neutral-50/70 dark:bg-neutral-800/30' : 'hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20'
                  }`}
                >
                  <td className="py-3.5 px-3">
                    <div
                      onClick={() => toggleSelect(act.id)}
                      className={`w-4 h-4 rounded border cursor-pointer flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#141619] border-[#141619] text-white dark:bg-white dark:border-white dark:text-[#141619]'
                          : 'border-neutral-300 dark:border-neutral-700'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-neutral-500 dark:text-neutral-400">
                    {act.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      {renderIcon(act.icon)}
                      <span className="font-bold text-[#141619] dark:text-white">
                        {act.activity}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#141619] dark:text-white">
                    {act.price}
                  </td>
                  <td className="py-3.5 px-4">
                    {getStatusBadge(act.status)}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-400">
                    {act.date}
                  </td>
                  <td className="py-3.5 px-4 text-right relative">
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === act.id ? null : act.id)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {activeMenuId === act.id && (
                      <div className="absolute right-4 mt-1 w-40 bg-white dark:bg-[#1A1D22] rounded-2xl shadow-xl border border-black/[0.06] p-1.5 z-40 text-xs">
                        <button
                          onClick={() => { showToast(`Viewing invoice ${act.id}`); setActiveMenuId(null); }}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-neutral-100 flex items-center gap-2"
                        >
                          <Eye className="w-3.5 h-3.5 text-neutral-400" /> View Details
                        </button>
                        <button
                          onClick={() => { showToast(`Downloaded invoice ${act.id}.pdf`); setActiveMenuId(null); }}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-neutral-100 flex items-center gap-2"
                        >
                          <Download className="w-3.5 h-3.5 text-neutral-400" /> Download PDF
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

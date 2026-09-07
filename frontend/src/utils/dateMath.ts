import { EnrollmentStatus } from '../types';

/**
 * Adds whole months to a given date string (YYYY-MM-DD)
 * Matches the core PRD/TRD requirement:
 * "endDate = addMonths(startDate, course.durationMonths)"
 */
export function calculateEndDate(startDateStr: string, durationMonths: number): string {
  if (!startDateStr || isNaN(durationMonths) || durationMonths <= 0) return '';
  
  const [year, month, day] = startDateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  // Add months
  date.setMonth(date.getMonth() + durationMonths);
  
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  
  return `${y}-${m}-${d}`;
}

/**
 * Derives student status automatically based on dates:
 * UPCOMING (start date in future)
 * ACTIVE (today within start & end window)
 * COMPLETED (today past end date)
 */
export function deriveStatusFromDates(startDateStr: string, endDateStr: string): EnrollmentStatus {
  if (!startDateStr || !endDateStr) return 'ACTIVE';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const start = new Date(startDateStr);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(endDateStr);
  end.setHours(23, 59, 59, 999);
  
  if (today < start) return 'UPCOMING';
  if (today > end) return 'COMPLETED';
  return 'ACTIVE';
}

/**
 * Formats YYYY-MM-DD into a human-friendly string like "15 Aug 2026"
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * Check if a given date falls within [startDate, endDate]
 */
export function isDateWithinWindow(checkDateStr: string, startDateStr: string, endDateStr: string): boolean {
  const check = new Date(checkDateStr).getTime();
  const start = new Date(startDateStr).getTime();
  const end = new Date(endDateStr).getTime();
  return check >= start && check <= end;
}

/**
 * Adds integer months to a given date.
 * TRD Rule: endDate = addMonths(startDate, course.durationMonths)
 */
export function addMonths(startDate: Date | string, months: number): Date {
  const date = new Date(startDate);
  date.setMonth(date.getMonth() + months);
  return date;
}

/**
 * Derives student enrollment status relative to today:
 * UPCOMING (start date in future)
 * ACTIVE (today within enrollment window)
 * COMPLETED (past end date)
 */
export function deriveStatus(startDate: Date | string, endDate: Date | string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  if (today < start) return 'UPCOMING';
  if (today > end) return 'COMPLETED';
  return 'ACTIVE';
}

/**
 * Checks if a date falls within [startDate, endDate]
 */
export function isWithinWindow(checkDate: Date | string, startDate: Date | string, endDate: Date | string): boolean {
  const check = new Date(checkDate).getTime();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  return check >= start && check <= end;
}

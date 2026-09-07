import { z } from 'zod';

export const markAttendanceSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  courseId: z.string().min(1, 'Course ID is required'),
  date: z.string().refine(val => !isNaN(Date.parse(val)), 'Valid date (YYYY-MM-DD) is required'),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE']),
  checkInAt: z.string().optional(),
  checkOutAt: z.string().optional(),
  markedBy: z.string().optional(),
  notes: z.string().optional()
});

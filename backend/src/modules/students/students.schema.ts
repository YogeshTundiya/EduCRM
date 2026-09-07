import { z } from 'zod';

export const createStudentSchema = z.object({
  name: z.string().min(2, 'Student name is required'),
  email: z.string().email('Valid email address is required'),
  phone: z.string().optional(),
  photoUrl: z.string().optional(),
  courseId: z.string().min(1, 'Course ID is required'),
  professorId: z.string().optional(),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Valid start date (YYYY-MM-DD) is required')
});

export const updateStudentSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  photoUrl: z.string().optional(),
  courseId: z.string().optional(),
  professorId: z.string().optional(),
  startDate: z.string().optional(),
  status: z.enum(['UPCOMING', 'ACTIVE', 'COMPLETED', 'DROPPED']).optional()
});

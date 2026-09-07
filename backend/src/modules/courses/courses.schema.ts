import { z } from 'zod';

export const createCourseSchema = z.object({
  name: z.string().min(2, 'Course name is required'),
  type: z.enum(['TECHNICAL', 'NON_TECHNICAL']),
  durationMonths: z.number().int().positive('Duration in months must be a positive integer'),
  description: z.string().optional(),
  modules: z.array(z.string()).optional()
});

export const updateCourseSchema = createCourseSchema.partial();

export const addModuleSchema = z.object({
  name: z.string().min(1, 'Module name is required'),
  order: z.number().int().optional()
});

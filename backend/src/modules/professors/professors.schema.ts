import { z } from 'zod';

export const createProfessorSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  specialization: z.string().min(2, 'Specialization is required'),
  photoUrl: z.string().url().optional().or(z.literal('')),
  assignedCourses: z.array(z.string()).optional()
});

export const updateProfessorSchema = createProfessorSchema.partial();

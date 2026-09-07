import { prisma } from '../../config/db';
import { addMonths, deriveStatus } from '../../utils/date.util';

export class CoursesService {
  static async listCourses(filterType?: string, status?: string) {
    const where: any = {};
    if (filterType && filterType !== 'ALL') where.type = filterType;
    if (status) where.status = status;

    const courses = await prisma.course.findMany({
      where,
      include: {
        modules: { orderBy: { order: 'asc' } },
        _count: { select: { students: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return courses.map(c => ({
      ...c,
      activeStudentCount: c._count.students,
      modules: c.modules.map(m => m.name)
    }));
  }

  static async getById(id: string) {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        modules: { orderBy: { order: 'asc' } },
        professors: { include: { professor: true } },
        students: true
      }
    });
    return course;
  }

  static async createCourse(data: {
    name: string;
    type: string;
    durationMonths: number;
    description?: string;
    modules?: string[];
  }) {
    const course = await prisma.course.create({
      data: {
        name: data.name,
        type: data.type,
        durationMonths: data.durationMonths,
        description: data.description || '',
        status: 'ACTIVE',
        modules: data.modules ? {
          create: data.modules.map((modName, index) => ({
            name: modName,
            order: index
          }))
        } : undefined
      },
      include: { modules: true }
    });
    return course;
  }

  static async updateCourse(id: string, data: any) {
    const existing = await prisma.course.findUnique({ where: { id } });
    if (!existing) throw new Error('Course not found');

    const updated = await prisma.course.update({
      where: { id },
      data: {
        name: data.name,
        type: data.type,
        durationMonths: data.durationMonths,
        description: data.description,
        status: data.status
      }
    });

    // If duration was updated, recalculate endDate and status for all enrolled students
    if (data.durationMonths && data.durationMonths !== existing.durationMonths) {
      const students = await prisma.student.findMany({ where: { courseId: id } });
      for (const s of students) {
        const newEndDate = addMonths(s.startDate, data.durationMonths);
        const newStatus = s.status === 'DROPPED' ? 'DROPPED' : deriveStatus(s.startDate, newEndDate);
        await prisma.student.update({
          where: { id: s.id },
          data: { endDate: newEndDate, status: newStatus }
        });
      }
    }

    return updated;
  }

  static async archiveCourse(id: string) {
    return prisma.course.update({
      where: { id },
      data: { status: 'ARCHIVED' }
    });
  }

  static async addModule(courseId: string, name: string, order?: number) {
    return prisma.module.create({
      data: {
        courseId,
        name,
        order: order ?? 0
      }
    });
  }

  static async deleteModule(moduleId: string) {
    return prisma.module.delete({ where: { id: moduleId } });
  }
}

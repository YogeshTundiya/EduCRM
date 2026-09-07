import { prisma } from '../../config/db';
import { addMonths, deriveStatus } from '../../utils/date.util';
import { getPagination, PaginationParams } from '../../utils/pagination.util';

export class StudentsService {
  static async listStudents(filters: {
    search?: string;
    courseId?: string;
    professorId?: string;
    status?: string;
  } & PaginationParams) {
    const { skip, take, page, pageSize } = getPagination(filters);

    const where: any = {};
    if (filters.courseId && filters.courseId !== 'ALL') where.courseId = filters.courseId;
    if (filters.professorId && filters.professorId !== 'ALL') where.professorId = filters.professorId;
    if (filters.status && filters.status !== 'ALL') where.status = filters.status;

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { email: { contains: filters.search } },
        { phone: { contains: filters.search } }
      ];
    }

    const [total, students] = await Promise.all([
      prisma.student.count({ where }),
      prisma.student.findMany({
        where,
        include: {
          course: { select: { id: true, name: true, type: true, durationMonths: true } },
          professor: { select: { id: true, name: true, specialization: true } },
          attendance: { select: { status: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take
      })
    ]);

    const formatted = students.map(s => {
      const totalAtt = s.attendance.length;
      const presentAtt = s.attendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
      const rate = totalAtt > 0 ? Math.round((presentAtt / totalAtt) * 100) : 100;

      return {
        id: s.id,
        name: s.name,
        email: s.email,
        phone: s.phone,
        photoUrl: s.photoUrl,
        courseId: s.courseId,
        courseName: s.course?.name,
        professorId: s.professorId,
        professorName: s.professor?.name,
        startDate: s.startDate.toISOString().split('T')[0],
        endDate: s.endDate.toISOString().split('T')[0],
        status: s.status,
        attendanceRate: rate
      };
    });

    return {
      data: formatted,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }

  static async getById(id: string) {
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        course: {
          include: {
            modules: { orderBy: { order: 'asc' } }
          }
        },
        professor: true,
        attendance: { orderBy: { date: 'desc' } }
      }
    });

    if (!student) return null;

    const totalAtt = student.attendance.length;
    const presentAtt = student.attendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
    const attendanceRate = totalAtt > 0 ? Math.round((presentAtt / totalAtt) * 100) : 100;

    return {
      ...student,
      startDate: student.startDate.toISOString().split('T')[0],
      endDate: student.endDate.toISOString().split('T')[0],
      attendanceRate,
      modules: student.course.modules.map(m => m.name)
    };
  }

  static async createStudent(data: {
    name: string;
    email: string;
    phone?: string;
    photoUrl?: string;
    courseId: string;
    professorId?: string;
    startDate: string;
  }) {
    // 1. Fetch course duration in months
    const course = await prisma.course.findUnique({
      where: { id: data.courseId }
    });

    if (!course) throw new Error('Course not found');

    const startDateObj = new Date(data.startDate);

    // 2. Compute endDate = addMonths(startDate, course.durationMonths)
    const endDateObj = addMonths(startDateObj, course.durationMonths);

    // 3. Derive status automatically
    const status = deriveStatus(startDateObj, endDateObj);

    const student = await prisma.student.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        photoUrl: data.photoUrl || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        courseId: data.courseId,
        professorId: data.professorId || null,
        startDate: startDateObj,
        endDate: endDateObj,
        status: status
      },
      include: {
        course: true,
        professor: true
      }
    });

    return {
      ...student,
      startDate: student.startDate.toISOString().split('T')[0],
      endDate: student.endDate.toISOString().split('T')[0]
    };
  }

  static async updateStudent(id: string, data: any) {
    const existing = await prisma.student.findUnique({
      where: { id },
      include: { course: true }
    });

    if (!existing) throw new Error('Student not found');

    let newStartDate = existing.startDate;
    let newCourseDuration = existing.course.durationMonths;

    if (data.startDate) {
      newStartDate = new Date(data.startDate);
    }

    if (data.courseId && data.courseId !== existing.courseId) {
      const course = await prisma.course.findUnique({ where: { id: data.courseId } });
      if (course) newCourseDuration = course.durationMonths;
    }

    // Recompute end date if course or startDate changed
    const newEndDate = addMonths(newStartDate, newCourseDuration);
    const newStatus = data.status 
      ? data.status 
      : (existing.status === 'DROPPED' ? 'DROPPED' : deriveStatus(newStartDate, newEndDate));

    const updated = await prisma.student.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        photoUrl: data.photoUrl,
        courseId: data.courseId,
        professorId: data.professorId,
        startDate: newStartDate,
        endDate: newEndDate,
        status: newStatus
      },
      include: { course: true, professor: true }
    });

    return {
      ...updated,
      startDate: updated.startDate.toISOString().split('T')[0],
      endDate: updated.endDate.toISOString().split('T')[0]
    };
  }

  static async deleteStudent(id: string) {
    return prisma.student.delete({ where: { id } });
  }
}

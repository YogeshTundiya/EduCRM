import { prisma } from '../../config/db';

export class ProfessorsService {
  static async listProfessors(search?: string) {
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { specialization: { contains: search } }
      ];
    }

    const profs = await prisma.professor.findMany({
      where,
      include: {
        courses: { include: { course: true } },
        students: { select: { id: true, name: true, photoUrl: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return profs.map(p => ({
      id: p.id,
      name: p.name,
      email: p.email,
      phone: p.phone,
      specialization: p.specialization,
      photoUrl: p.photoUrl,
      status: p.status,
      assignedCourses: p.courses.map(c => c.courseId),
      courseDetails: p.courses.map(c => ({ id: c.course.id, name: c.course.name })),
      activeStudentCount: p.students.length,
      students: p.students
    }));
  }

  static async getById(id: string) {
    const prof = await prisma.professor.findUnique({
      where: { id },
      include: {
        courses: { include: { course: true } },
        students: true
      }
    });
    return prof;
  }

  static async createProfessor(data: {
    name: string;
    email: string;
    phone?: string;
    specialization: string;
    photoUrl?: string;
    assignedCourses?: string[];
  }) {
    const prof = await prisma.professor.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        specialization: data.specialization,
        photoUrl: data.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        status: 'ACTIVE',
        courses: data.assignedCourses ? {
          create: data.assignedCourses.map(courseId => ({
            course: { connect: { id: courseId } }
          }))
        } : undefined
      },
      include: { courses: true }
    });
    return prof;
  }

  static async updateProfessor(id: string, data: any) {
    if (data.assignedCourses) {
      await prisma.courseProfessor.deleteMany({ where: { professorId: id } });
      await prisma.courseProfessor.createMany({
        data: data.assignedCourses.map((cId: string) => ({
          professorId: id,
          courseId: cId
        }))
      });
      delete data.assignedCourses;
    }

    return prisma.professor.update({
      where: { id },
      data
    });
  }

  static async deleteProfessor(id: string) {
    return prisma.professor.delete({ where: { id } });
  }
}

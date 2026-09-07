import { prisma } from '../../config/db';
import { isWithinWindow } from '../../utils/date.util';

export class AttendanceService {
  static async getRoster(courseId: string, dateStr: string) {
    const targetDate = new Date(dateStr);
    targetDate.setHours(0, 0, 0, 0);

    // Get all students enrolled in this course
    const students = await prisma.student.findMany({
      where: {
        courseId,
        startDate: { lte: targetDate },
        endDate: { gte: targetDate },
        status: { not: 'DROPPED' }
      },
      include: {
        attendance: {
          where: {
            date: targetDate
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    return students.map(s => {
      const record = s.attendance[0] || null;
      return {
        studentId: s.id,
        studentName: s.name,
        photoUrl: s.photoUrl,
        email: s.email,
        startDate: s.startDate.toISOString().split('T')[0],
        endDate: s.endDate.toISOString().split('T')[0],
        status: record?.status || null,
        checkInAt: record?.checkInAt ? record.checkInAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : null,
        checkOutAt: record?.checkOutAt ? record.checkOutAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : null,
        notes: record?.notes || null,
        markedBy: record?.markedBy || null
      };
    });
  }

  static async markAttendance(data: {
    studentId: string;
    courseId: string;
    date: string;
    status: string;
    checkInAt?: string;
    checkOutAt?: string;
    markedBy?: string;
    notes?: string;
  }) {
    const targetDate = new Date(data.date);
    targetDate.setHours(0, 0, 0, 0);

    // Verify student exists and window covers date
    const student = await prisma.student.findUnique({
      where: { id: data.studentId }
    });

    if (!student) throw new Error('Student not found');

    if (!isWithinWindow(targetDate, student.startDate, student.endDate)) {
      throw new Error(`Cannot mark attendance: Date ${data.date} is outside the student's enrollment period.`);
    }

    const checkInDate = data.status === 'ABSENT'
      ? null
      : (data.checkInAt ? new Date(data.checkInAt) : new Date());

    const checkOutDate = data.checkOutAt ? new Date(data.checkOutAt) : null;

    const record = await prisma.attendance.upsert({
      where: {
        studentId_date: {
          studentId: data.studentId,
          date: targetDate
        }
      },
      update: {
        status: data.status,
        checkInAt: checkInDate,
        checkOutAt: checkOutDate,
        markedBy: data.markedBy || 'Admin',
        notes: data.notes
      },
      create: {
        studentId: data.studentId,
        courseId: data.courseId,
        date: targetDate,
        status: data.status,
        checkInAt: checkInDate,
        checkOutAt: checkOutDate,
        markedBy: data.markedBy || 'Admin',
        notes: data.notes
      }
    });

    return {
      ...record,
      checkInAt: record.checkInAt ? record.checkInAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : null,
      checkOutAt: record.checkOutAt ? record.checkOutAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : null
    };
  }

  static async getStudentHistory(studentId: string) {
    const records = await prisma.attendance.findMany({
      where: { studentId },
      include: {
        student: { select: { name: true, courseId: true } }
      },
      orderBy: { date: 'desc' }
    });

    return records.map(r => ({
      ...r,
      date: r.date.toISOString().split('T')[0],
      checkInAt: r.checkInAt ? r.checkInAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : null,
      checkOutAt: r.checkOutAt ? r.checkOutAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : null
    }));
  }
}

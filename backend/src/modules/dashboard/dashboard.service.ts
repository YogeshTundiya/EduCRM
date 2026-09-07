import { prisma } from '../../config/db';

export class DashboardService {
  static async getStats() {
    const [totalStudents, activeStudents, totalCourses, totalProfessors, attendanceRecords] = await Promise.all([
      prisma.student.count(),
      prisma.student.count({ where: { status: 'ACTIVE' } }),
      prisma.course.count({ where: { status: 'ACTIVE' } }),
      prisma.professor.count({ where: { status: 'ACTIVE' } }),
      prisma.attendance.findMany({ select: { status: true } })
    ]);

    const presentOrLate = attendanceRecords.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
    const attendancePercentage = attendanceRecords.length > 0 
      ? Math.round((presentOrLate / attendanceRecords.length) * 100) 
      : 95;

    // Currency values in Indian Rupees (₹)
    return {
      kpi: {
        totalStudents,
        activeStudents,
        totalCourses,
        totalProfessors,
        attendanceRate: `${attendancePercentage}%`,
        totalBalance: '₹6,89,372.00',
        totalEarnings: '₹95,000',
        totalSpending: '₹70,000',
        totalIncome: '₹1,05,000',
        totalRevenue: '₹85,000'
      },
      trends: [
        { month: 'Jan', profit: 38, loss: 19 },
        { month: 'Feb', profit: 41, loss: 15 },
        { month: 'Mar', profit: 34, loss: 18 },
        { month: 'Apr', profit: 43, loss: 24 },
        { month: 'May', profit: 38, loss: 16 },
        { month: 'Jun', profit: 50, loss: 33 },
        { month: 'Jul', profit: 41, loss: 21 },
        { month: 'Aug', profit: 36, loss: 16 }
      ]
    };
  }
}

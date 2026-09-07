import { Request, Response, NextFunction } from 'express';
import { AttendanceService } from './attendance.service';

export class AttendanceController {
  static async getRoster(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = req.query.courseId as string;
      const date = req.query.date as string;

      if (!courseId || !date) {
        return res.status(400).json({ error: 'courseId and date query parameters are required' });
      }

      const roster = await AttendanceService.getRoster(courseId, date);
      res.json({ data: roster });
    } catch (err) {
      next(err);
    }
  }

  static async mark(req: Request, res: Response, next: NextFunction) {
    try {
      const record = await AttendanceService.markAttendance(req.body);
      res.status(201).json({ data: record, message: 'Attendance recorded successfully' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getStudentHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const history = await AttendanceService.getStudentHistory(req.params.id);
      res.json({ data: history });
    } catch (err) {
      next(err);
    }
  }
}

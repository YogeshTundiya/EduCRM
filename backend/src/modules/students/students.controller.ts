import { Request, Response, NextFunction } from 'express';
import { StudentsService } from './students.service';

export class StudentsController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, courseId, professorId, status, page, pageSize } = req.query;
      const result = await StudentsService.listStudents({
        search: search as string,
        courseId: courseId as string,
        professorId: professorId as string,
        status: status as string,
        page: page ? parseInt(page as string, 10) : undefined,
        pageSize: pageSize ? parseInt(pageSize as string, 10) : undefined
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const student = await StudentsService.getById(req.params.id);
      if (!student) return res.status(404).json({ error: 'Student not found' });
      res.json({ data: student });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const student = await StudentsService.createStudent(req.body);
      res.status(201).json({ data: student });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const student = await StudentsService.updateStudent(req.params.id, req.body);
      res.json({ data: student });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await StudentsService.deleteStudent(req.params.id);
      res.json({ message: 'Student deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}

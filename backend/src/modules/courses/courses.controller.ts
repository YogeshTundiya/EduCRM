import { Request, Response, NextFunction } from 'express';
import { CoursesService } from './courses.service';

export class CoursesController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const type = req.query.type as string;
      const status = req.query.status as string;
      const courses = await CoursesService.listCourses(type, status);
      res.json({ data: courses });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await CoursesService.getById(req.params.id);
      if (!course) return res.status(404).json({ error: 'Course not found' });
      res.json({ data: course });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await CoursesService.createCourse(req.body);
      res.status(201).json({ data: course });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await CoursesService.updateCourse(req.params.id, req.body);
      res.json({ data: course });
    } catch (err) {
      next(err);
    }
  }

  static async archive(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await CoursesService.archiveCourse(req.params.id);
      res.json({ data: course, message: 'Course archived successfully' });
    } catch (err) {
      next(err);
    }
  }

  static async addModule(req: Request, res: Response, next: NextFunction) {
    try {
      const module = await CoursesService.addModule(req.params.id, req.body.name, req.body.order);
      res.status(201).json({ data: module });
    } catch (err) {
      next(err);
    }
  }

  static async deleteModule(req: Request, res: Response, next: NextFunction) {
    try {
      await CoursesService.deleteModule(req.params.id);
      res.json({ message: 'Module removed' });
    } catch (err) {
      next(err);
    }
  }
}

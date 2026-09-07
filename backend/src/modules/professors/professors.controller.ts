import { Request, Response, NextFunction } from 'express';
import { ProfessorsService } from './professors.service';

export class ProfessorsController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string;
      const profs = await ProfessorsService.listProfessors(search);
      res.json({ data: profs });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const prof = await ProfessorsService.getById(req.params.id);
      if (!prof) return res.status(404).json({ error: 'Professor not found' });
      res.json({ data: prof });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const prof = await ProfessorsService.createProfessor(req.body);
      res.status(201).json({ data: prof });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const prof = await ProfessorsService.updateProfessor(req.params.id, req.body);
      res.json({ data: prof });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ProfessorsService.deleteProfessor(req.params.id);
      res.json({ message: 'Professor removed successfully' });
    } catch (err) {
      next(err);
    }
  }
}

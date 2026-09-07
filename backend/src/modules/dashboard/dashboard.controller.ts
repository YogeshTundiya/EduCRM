import { Request, Response, NextFunction } from 'express';
import { DashboardService } from './dashboard.service';

export class DashboardController {
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await DashboardService.getStats();
      res.json({ data: stats });
    } catch (err) {
      next(err);
    }
  }
}

import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.json(result);
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, role } = req.body;
      const result = await AuthService.register({ name, email, passwordPlain: password, role });
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const user = await AuthService.getMe(req.user.id);
      res.json({ data: user });
    } catch (err) {
      next(err);
    }
  }
}

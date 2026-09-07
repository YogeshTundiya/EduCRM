import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import { loginSchema, registerSchema } from './auth.schema';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/login', validate(loginSchema), AuthController.login);
router.post('/register', validate(registerSchema), AuthController.register);
router.get('/me', requireAuth, AuthController.getMe);

export default router;

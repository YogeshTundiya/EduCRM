import express, { Request, Response } from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import { errorHandler } from './middlewares/error.middleware';

// Routes
import authRoutes from './modules/auth/auth.routes';
import coursesRoutes from './modules/courses/courses.routes';
import professorsRoutes from './modules/professors/professors.routes';
import studentsRoutes from './modules/students/students.routes';
import attendanceRoutes from './modules/attendance/attendance.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';

export const app = express();

// Middlewares
app.use(cors({
  origin: [ENV.CORS_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// Request logging in development
if (ENV.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Health Check
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'Technoglobe PRO Management API',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Mount API v1 Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/courses', coursesRoutes);
app.use('/api/v1/professors', professorsRoutes);
app.use('/api/v1/students', studentsRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Centralized Error Middleware
app.use(errorHandler);

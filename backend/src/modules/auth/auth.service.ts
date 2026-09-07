import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/db';
import { ENV } from '../../config/env';

export class AuthService {
  static async login(email: string, passwordPlain: string) {
    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    if (!admin) {
      throw new Error('Invalid email or password');
    }

    const isValid = await bcrypt.compare(passwordPlain, admin.passwordHash);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    const accessToken = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      ENV.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const refreshToken = jwt.sign(
      { id: admin.id },
      ENV.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    return {
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      },
      accessToken,
      refreshToken
    };
  }

  static async register(data: { name: string; email: string; passwordPlain: string; role?: string }) {
    const existing = await prisma.admin.findUnique({
      where: { email: data.email }
    });

    if (existing) {
      throw new Error('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(data.passwordPlain, 12);
    const admin = await prisma.admin.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role || 'ADMIN'
      }
    });

    const accessToken = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      ENV.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const refreshToken = jwt.sign(
      { id: admin.id },
      ENV.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    return {
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      },
      accessToken,
      refreshToken
    };
  }

  static async getMe(adminId: string) {
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });
    return admin;
  }
}


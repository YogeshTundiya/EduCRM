import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  JWT_SECRET: process.env.JWT_SECRET || 'technoglobe_super_secure_jwt_secret_key_2026',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'technoglobe_refresh_token_secret_key_2026',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173'
};

import dotenv from 'dotenv';
import type { SignOptions } from 'jsonwebtoken';

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 3000,
  jwtSecret: process.env.JWT_SECRET || 'default_secret',
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN || '1d') as SignOptions['expiresIn'],
};

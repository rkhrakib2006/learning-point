import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export type Role = 'STUDENT' | 'TEACHER' | 'ADMIN';
export interface JwtPayload { sub: string; role: Role; cls?: number; }

export const signAccess = (p: JwtPayload) => jwt.sign(p, env.JWT_ACCESS_SECRET, { expiresIn: '7d' });
export const signRefresh = (p: JwtPayload) => jwt.sign(p, env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
export const verifyAccess = (t: string) => jwt.verify(t, env.JWT_ACCESS_SECRET) as JwtPayload;
export const verifyRefresh = (t: string) => jwt.verify(t, env.JWT_REFRESH_SECRET) as JwtPayload;
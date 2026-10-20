import { prisma } from '../config/db.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signAccess, signRefresh } from '../utils/jwt.js';

export async function registerUser(data: any) {
  const hash = await hashPassword(data.password);
  return prisma.user.create({
    data: {
      email: data.email.toLowerCase(), passwordHash: hash, fullName: data.fullName,
      role: data.role, classLevel: data.classLevel, school: data.school,
    },
    select: { id: true, email: true, role: true, classLevel: true, fullName: true },
  });
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  if (!user.isActive) throw Object.assign(new Error('Account disabled'), { status: 403 });
  if (user.lockedUntil && user.lockedUntil > new Date()) throw Object.assign(new Error('Account locked'), { status: 423 });

  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) {
    const failed = user.failedLogins + 1;
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLogins: failed, lockedUntil: failed >= 5 ? new Date(Date.now() + 15 * 60_000) : null },
    });
    throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  }

  await prisma.user.update({ where: { id: user.id }, data: { failedLogins: 0, lockedUntil: null } });
  const payload = { sub: user.id, role: user.role as any, cls: user.classLevel ?? undefined };
  return {
    access: signAccess(payload), refresh: signRefresh(payload),
    user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName, classLevel: user.classLevel, isAccessUnlocked: user.isAccessUnlocked, allowedAccessCode: user.allowedAccessCode },
  };
}
import { prisma } from '../config/prisma.js';

export class UserRepository {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
  }

  upsertProfile(
    userId: number,
    data: {
      firstName?: string | null;
      lastName?: string | null;
      birthDate?: Date | null;
      address?: string | null;
      phone?: string | null;
    },
  ) {
    return prisma.userProfile.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  }

  create(data: { name: string; email: string; password: string }) {
    return prisma.user.create({
      data,
    });
  }
}

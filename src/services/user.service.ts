import { prisma } from "../config/prisma";

export class UserServices {
  getAllUsersService = async () => {
    return await prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created: true,
        updated: true,
      },
    });
  };

  getUserById = async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId, isActive: true },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created: true,
        updated: true,
      },
    });

    if (!user) {
      const error = new Error("User not found") as any;
      error.statusCode = 404;
      throw error;
    }

    return user;
  };
}

export const userServices = new UserServices();

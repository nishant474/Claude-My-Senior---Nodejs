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
}

export const userServices = new UserServices();

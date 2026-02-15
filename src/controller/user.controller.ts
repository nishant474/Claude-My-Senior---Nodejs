import { Request, Response, NextFunction } from "express";
import { userServices } from "../services/user.service";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await userServices.getAllUsersService();
    res.status(200).json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    next(error);
  }
};

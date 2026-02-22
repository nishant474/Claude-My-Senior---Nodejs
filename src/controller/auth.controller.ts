import { NextFunction, Request, Response } from "express";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import { authService } from "../services/auth.service";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    //Validate Input
    const validatedInput = registerSchema.parse(req.body);

    //Register user
    const result = await authService.register(validatedInput);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    //Validate Input
    const { email, password } = loginSchema.parse(req.body);

    //Login user
    const result = await authService.login(email, password);

    res.status(200).json({
      success: true,
      message: "Login successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

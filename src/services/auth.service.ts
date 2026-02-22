import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { RegisterInput } from "../validators/auth.validator";
import { prisma } from "../config/prisma";

export class AuthService {
  //Hash Password
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  //Verify Plain password and hash password
  async verifyPassword(
    plainPassword: string,
    hashPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashPassword);
  }

  //Generate JWT Token
  generateToken(userId: string, email: string, role: string): string {
    return jwt.sign({ userId, email, role }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });
  }

  //Register New User
  async register(data: RegisterInput) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      const error = new Error("User with this email already exists") as any;
      error.statusCode = 409;
      throw error;
    }

    //Hash Password
    const hashedPassword = await this.hashPassword(data.password);

    //Create User
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created: true,
      },
    });

    //Generate Token
    const token = this.generateToken(user.id, user.email, user.role);

    return { user, token };
  }

  //Login user
  async login(email: string, password: string) {
    //Find User
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      const error = new Error("Invalid credentials") as any;
      error.statusCode = 401;
      throw error;
    }

    // Verify Password
    const isValidPassword = await this.verifyPassword(
      password,
      user.passwordHash,
    );

    if (!isValidPassword) {
      const error = new Error("Invalid credentials") as any;
      error.statusCode = 401;
      throw error;
    }

    //Generate Token
    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
}

export const authService = new AuthService();

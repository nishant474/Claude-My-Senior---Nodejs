import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Please enter atleast 2 character")
    .max(100, "Please do not exceed 100 character"),
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z
    .string()
    .min(8, "Please Enter at least 8 Character")
    .max(100, "Please do not exceed 100 character")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

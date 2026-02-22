import dotenv from "dotenv";

dotenv.config();

const requireEnvVars = ["DATABASE_URL", "PORT", "JWT_SECRET"] as const;

for (const envVar of requireEnvVars) {
  if (!process.env[envVar])
    throw new Error(`Missing required environment variable: ${envVar}`);
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  PORT: parseInt(process.env.PORT || "3000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
} as const;

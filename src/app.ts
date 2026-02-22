import express, { Request, Response } from "express";
import errorHandler from "./middlewares/errorHandler";
import userRoutes from "./routes/user.routes";
import helmet from "helmet";
import cors from "cors";
import { env } from "./config/env";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";

const app = express();

//Security Middleware
app.use(helmet());
app.use(cors());

//Logging
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

// Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Health Check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    timeStamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
  });
});

// Api Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route Not Found",
  });
});

//Error Middleware
app.use(errorHandler);

export default app;

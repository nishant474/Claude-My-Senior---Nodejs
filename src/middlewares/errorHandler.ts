import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";

interface AppError extends Error {
  statusCode?: number;
  details?: any;
}

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err.stack);

  // Prisma errors (unique constraint, not found, etc.)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        error: "Resource already exists",
      });
    }
    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        error: "Resource not found",
      });
    }
  }

  // Validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      details: err.details,
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: "Invalid token",
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
};

export default errorHandler;

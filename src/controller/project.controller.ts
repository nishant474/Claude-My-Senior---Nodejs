import { NextFunction, Request, Response } from "express";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../validators/project.validator";
import { projectService } from "../services/project.service";

export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const validatedData = createProjectSchema.parse(req.body);

    const project = await projectService.createProject(userId, validatedData);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const role = req.user!.role;

    const project = await projectService.getProjects(userId, role);

    res.status(200).json({
      success: true,
      data: project,
      count: project.length,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const role = req.user!.role;

    const project = await projectService.getProjectById(
      id.toString(),
      userId,
      role,
    );

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const role = req.user!.role;
    const validatedData = updateProjectSchema.parse(req.body);

    const project = await projectService.updateProject(
      id.toString(),
      userId,
      role,
      validatedData,
    );

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const role = req.user!.role;

    const result = await projectService.deleteProject(
      id.toString(),
      userId,
      role,
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

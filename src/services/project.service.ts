import { Role } from "@prisma/client";
import { prisma } from "../config/prisma";
import {
  CreateProjectInput,
  UpdateProjectInput,
} from "../validators/project.validator";

export class ProjectService {
  async createProject(userId: string, data: CreateProjectInput) {
    return await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        userId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        userId: true,
        created: true,
        updated: true,
      },
    });
  }

  async getProjects(userId: string, role: string) {
    const where =
      role === Role.ADMIN ? { isActive: true } : { isActive: true, userId };
    return await prisma.project.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        userId: true,
        created: true,
        updated: true,
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: { created: "desc" },
    });
  }

  async getProjectById(projectId: string, userId: string, role: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        tasks: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            status: true,
            priority: true,
            dueDate: true,
            assignedTo: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    if (!project || !project.isActive) {
      const error = new Error("Project not found") as any;
      error.statusCode = 404;
      throw error;
    }

    //Authorization Check
    if (role !== Role.ADMIN && project.userId !== userId) {
      const error = new Error("Access denied") as any;
      error.statusCode = 403;
      throw error;
    }

    return project;
  }

  async updateProject(
    projectId: string,
    userId: string,
    role: string,
    data: UpdateProjectInput,
  ) {
    // First verify ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || !project.isActive) {
      const error = new Error("Project not found") as any;
      error.statusCode = 404;
      throw error;
    }

    if (role !== Role.ADMIN && project.userId !== userId) {
      const error = new Error("Access Denied") as any;
      error.statusCode = 403;
      throw error;
    }

    return await prisma.project.update({
      where: { id: projectId },
      data,
      select: {
        id: true,
        name: true,
        description: true,
        userId: true,
        updated: true,
      },
    });
  }

  async deleteProject(projectId: string, userId: string, role: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || !project.isActive) {
      const error = new Error("Project not found") as any;
      error.statusCode = 404;
      throw error;
    }

    if (role !== Role.ADMIN && project.userId !== userId) {
      const error = new Error("Access Denied") as any;
      error.statusCode = 403;
      throw error;
    }

    // Soft delete
    await prisma.project.update({
      where: { id: projectId },
      data: { isActive: false },
    });

    return { message: "Project deleted successfully" };
  }
}

export const projectService = new ProjectService();

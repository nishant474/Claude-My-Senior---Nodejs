import { z } from "zod";
import { TaskStatus, Priority } from "@prisma/client";

export const createTaskSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(Priority).optional(),
  dueDate: z.string().datetime(),
  assignedToId: z.string().uuid().optional(),
});

export const updateTaskSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(Priority).optional(),
  dueDate: z.string().datetime().optional(),
  assignedToId: z.string().uuid().nullable().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

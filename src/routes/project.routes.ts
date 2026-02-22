import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
} from "../controller/project.controller";

const router = Router();

router.use(authenticate);

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.patch("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;

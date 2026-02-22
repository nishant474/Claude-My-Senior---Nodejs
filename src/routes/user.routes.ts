import { Router } from "express";
import { getAllUsers, getCurrentUser } from "../controller/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", authenticate, requireRole(Role.ADMIN), getAllUsers);
router.get("/me", authenticate, getCurrentUser);

export default router;

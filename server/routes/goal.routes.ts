import { Router } from "express";
import { getGoals, addGoal, updateGoal, deleteGoal } from "../controllers/goalController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authenticateToken, getGoals);
router.post("/", authenticateToken, addGoal);
router.put("/:id", authenticateToken, updateGoal);
router.delete("/:id", authenticateToken, deleteGoal);

export default router;

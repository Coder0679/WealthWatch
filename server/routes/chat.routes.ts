import { Router } from "express";
import { createSession, sendMessage } from "../controllers/chatController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/session", authenticateToken, createSession);
router.post("/message", authenticateToken, sendMessage);

export default router;

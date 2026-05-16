import { Router } from "express";
import { sendMessage } from "../controllers/chatController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/message", authenticateToken, sendMessage);

export default router;

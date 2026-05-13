import { Router } from 'express';
import { getInsights, getMonthlySummary } from '../controllers/aiController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/insights', authenticateToken, getInsights);
router.get('/monthly-summary', authenticateToken, getMonthlySummary);

export default router;

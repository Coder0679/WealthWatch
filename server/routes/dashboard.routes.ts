import { Router } from 'express';
import { getSummary, getCharts } from '../controllers/dashboardController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/summary', authenticateToken, getSummary);
router.get('/charts', authenticateToken, getCharts);

export default router;

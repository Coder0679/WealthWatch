import { Router } from 'express';
import { generateMonthlyReport, getReports } from '../controllers/reportController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticateToken as any, getReports as any);
router.post('/generate', authenticateToken as any, generateMonthlyReport as any);

export default router;

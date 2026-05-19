import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { getMonthlyNarrativeAudio } from '../controllers/ttsController.js';

const router = Router();

router.post('/monthly-narrative-tts', authenticateToken, getMonthlyNarrativeAudio);

export default router;


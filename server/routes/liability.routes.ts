import { Router } from 'express';
import { getLiabilities, addLiability, deleteLiability } from '../controllers/liabilityController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticateToken, getLiabilities);
router.post('/', authenticateToken, addLiability);
router.delete('/:id', authenticateToken, deleteLiability);

export default router;

import { Router } from 'express';
import { getAssets, addAsset, deleteAsset } from '../controllers/assetController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticateToken, getAssets);
router.post('/', authenticateToken, addAsset);
router.delete('/:id', authenticateToken, deleteAsset);

export default router;

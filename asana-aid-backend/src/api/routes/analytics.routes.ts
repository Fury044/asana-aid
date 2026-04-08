import { Router } from 'express';
import { getStats, getStreaks } from '../controllers/analytics.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/stats', authenticateToken, getStats);
router.get('/streaks', authenticateToken, getStreaks);

export default router;
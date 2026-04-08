import { Router } from 'express';
import { startSession, updateProgress, completeSession } from '../controllers/session.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
const router = Router();
router.post('/start', authenticateToken, startSession);
router.patch('/progress/:id', authenticateToken, updateProgress);
router.post('/complete/:id', authenticateToken, completeSession);
export default router;
//# sourceMappingURL=session.routes.js.map
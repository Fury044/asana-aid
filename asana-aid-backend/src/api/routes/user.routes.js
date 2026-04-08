import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/user.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
const router = Router();
router.get('/:id', authenticateToken, getProfile);
router.patch('/:id', authenticateToken, updateProfile);
export default router;
//# sourceMappingURL=user.routes.js.map
import { Router } from 'express';
import { createPlan, getDailyPlan } from '../controllers/plan.controller.js';
const router = Router();
router.post('/generate', createPlan);
router.get('/daily/:userId', getDailyPlan);
export default router;
//# sourceMappingURL=plan.routes.js.map
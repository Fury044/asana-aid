import { generatePlan } from '../../services/plan.service.js';
import pool from '../../database/db.js';
export const createPlan = async (req, res) => {
    const { userId } = req.body;
    try {
        const plan = await generatePlan(userId);
        res.status(201).json(plan);
    }
    catch (error) {
        res.status(500).json({ message: 'Error generating plan', error });
    }
};
export const getDailyPlan = async (req, res) => {
    const { userId } = req.params;
    try {
        // Current active plan for user
        const result = await pool.query('SELECT * FROM user_plans WHERE user_id = $1 AND is_active = true LIMIT 1', [userId]);
        res.json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching plan', error });
    }
};
//# sourceMappingURL=plan.controller.js.map
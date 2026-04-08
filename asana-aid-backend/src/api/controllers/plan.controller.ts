import type { Request, Response } from 'express';
import { generatePlan } from '../../services/plan.service.js';
import pool from '../../database/db.js';

export const createPlan = async (req: Request, res: Response) => {
  const { userId, conditions, goals, profile } = req.body;
  try {
    const plan = await generatePlan(userId, conditions, goals, profile);
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Error generating plan', error });
  }
};

export const getDailyPlan = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    // 1. Attempt to get the most recent active plan from DB
    const sessionRes = await pool.query(`
      SELECT s.id as session_id, p.id as plan_id 
      FROM user_plans p 
      JOIN yoga_sessions s ON p.id = s.plan_id
      WHERE p.user_id = $1 AND p.is_active = true 
      ORDER BY p.created_at DESC LIMIT 1
    `, [userId]);

    if (sessionRes.rows.length > 0) {
      const { session_id, plan_id } = sessionRes.rows[0];

      // Fetch the poses for this session
      const posesRes = await pool.query(`
        SELECT p.* 
        FROM yoga_poses p
        JOIN session_poses sp ON p.id = sp.pose_id 
        WHERE sp.session_id = $1
        ORDER BY sp.order_index ASC
      `, [session_id]);

      return res.json({
        planId: plan_id,
        sessionId: session_id,
        poses: posesRes.rows
      });
    }
  } catch (error) {
    console.warn("Database unreachable in getDailyPlan, falling back to instant generation");
  }

  // FALLBACK: Generate a fresh plan (mocked if DB still fails inside generatePlan)
  try {
    const plan = await generatePlan(userId as string);
    res.json(plan);
  } catch (genError) {
    res.status(500).json({ message: 'Critical failure in plan retrieval', error: genError });
  }
};

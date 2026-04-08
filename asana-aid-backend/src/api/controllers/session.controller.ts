import type { Request, Response } from 'express';
import pool from '../../database/db.js';

export const startSession = async (req: Request, res: Response) => {
  const { userId, sessionId } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO session_progress (user_id, session_id, status) VALUES ($1, $2, \'InProgress\') RETURNING id',
      [userId, sessionId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error starting session', error });
  }
};

export const updateProgress = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { poseIndex } = req.body;
  try {
    await pool.query('UPDATE session_progress SET current_pose_index = $1, last_accessed_at = CURRENT_TIMESTAMP WHERE id = $2', [poseIndex, id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error updating progress', error });
  }
};

export const completeSession = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query('UPDATE session_progress SET status = \'Completed\', completed_at = CURRENT_TIMESTAMP WHERE id = $1', [id]);
    // Logic to increment streaks could be called here or handled by a DB trigger
    res.json({ message: 'Session completed!' });
  } catch (error) {
    res.status(500).json({ message: 'Error completing session', error });
  }
};

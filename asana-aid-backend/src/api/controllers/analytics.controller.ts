import pool from '../../database/db.js';
import type { Request, Response } from 'express';

export const getStats = async (req: Request, res: Response) => {
  const { userId } = req.query;
  try {
    const sessions = await pool.query('SELECT count(*) FROM session_progress WHERE user_id = $1 AND status = \'Completed\'', [userId]);
    const totalTime = await pool.query('SELECT sum(base_duration) FROM yoga_poses yp JOIN session_poses sp ON yp.id = sp.pose_id JOIN session_progress spr ON spr.session_id = sp.session_id WHERE spr.user_id = $1 AND spr.status = \'Completed\'', [userId]);
    
    res.json({
      completedSessions: sessions.rows[0].count,
      totalMinutes: Math.floor(parseInt(totalTime.rows[0].sum || '0') / 60)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error });
  }
};

export const getStreaks = async (req: Request, res: Response) => {
  const { userId } = req.query;
  try {
    const result = await pool.query('SELECT current_streak, max_streak FROM streaks WHERE user_id = $1', [userId]);
    res.json(result.rows[0] || { current_streak: 0, max_streak: 0 });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching streaks', error });
  }
};

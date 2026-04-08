import pool from '../../database/db.js';
import type { Request, Response } from 'express';

export const getStats = async (req: Request, res: Response) => {
  const { userId } = req.query;
  try {
    const sessions = await pool.query('SELECT count(*) FROM session_progress WHERE user_id = $1 AND status = \'Completed\'', [userId]);
    
    // Sum duration of all completed poses across all completed sessions for this user
    const totalTime = await pool.query(`
      SELECT COALESCE(SUM(yp.base_duration), 0) as total_seconds
      FROM session_progress spr
      JOIN session_poses sp ON spr.session_id = sp.session_id
      JOIN yoga_poses yp ON sp.pose_id = yp.id
      WHERE spr.user_id = $1 AND spr.status = 'Completed'
    `, [userId]);
    
    res.json({
      completedSessions: parseInt(sessions.rows[0].count || '0'),
      totalMinutes: Math.floor(parseInt(totalTime.rows[0].total_seconds || '0') / 60)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error });
  }
};

export const getWeeklyActivity = async (req: Request, res: Response) => {
  const { userId } = req.query;
  try {
    // Fetches sum of minutes practiced per day for the last 7 days
    const result = await pool.query(`
      WITH days AS (
        SELECT generate_series(
          CURRENT_DATE - INTERVAL '6 days',
          CURRENT_DATE,
          '1 day'::interval
        )::date as day
      )
      SELECT 
        to_char(days.day, 'Dy') as label,
        COALESCE(SUM(yp.base_duration), 0) / 60 as minutes
      FROM days
      LEFT JOIN session_progress spr ON DATE(spr.completed_at) = days.day AND spr.user_id = $1 AND spr.status = 'Completed'
      LEFT JOIN session_poses sp ON spr.session_id = sp.session_id
      LEFT JOIN yoga_poses yp ON sp.pose_id = yp.id
      GROUP BY days.day
      ORDER BY days.day ASC
    `, [userId]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching weekly activity', error });
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

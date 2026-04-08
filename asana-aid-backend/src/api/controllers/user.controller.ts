import type { Request, Response } from 'express';
import pool from '../../database/db.js';

export const getProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM user_health_profiles WHERE user_id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Profile not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { age, weight, height, gender, experience_level } = req.body;
  try {
    const result = await pool.query(
      'UPDATE user_health_profiles SET age = $1, weight = $2, height = $3, gender = $4, experience_level = $5, updated_at = CURRENT_TIMESTAMP WHERE user_id = $6 RETURNING *',
      [age, weight, height, gender, experience_level, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
};

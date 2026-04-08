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
    const result = await pool.query(`
      INSERT INTO user_health_profiles (user_id, age, weight, height, gender, experience_level, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id) DO UPDATE SET 
        age = EXCLUDED.age, 
        weight = EXCLUDED.weight, 
        height = EXCLUDED.height, 
        gender = EXCLUDED.gender, 
        experience_level = EXCLUDED.experience_level, 
        updated_at = EXCLUDED.updated_at
      RETURNING *
    `, [id, age, weight, height, gender, experience_level]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ message: 'Error updating profile', error });
  }
};

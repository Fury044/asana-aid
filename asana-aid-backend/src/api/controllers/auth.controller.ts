import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../../database/db.js';

export const signup = async (req: Request, res: Response) => {
  const { email, password, full_name } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email',
      [email, passwordHash, full_name]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Fetch user stats and plan status from DB to sync with frontend
    const statsRes = await pool.query('SELECT count(*) FROM session_progress WHERE user_id = $1 AND status = \'Completed\'', [user.id]);
    const streakRes = await pool.query('SELECT current_streak FROM streaks WHERE user_id = $1', [user.id]);
    const planRes = await pool.query('SELECT id FROM user_plans WHERE user_id = $1 AND is_active = true LIMIT 1', [user.id]);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    
    res.json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        full_name: user.full_name,
        sessions: parseInt(statsRes.rows[0].count || '0'),
        streak: streakRes.rows[0]?.current_streak || 0,
        planGenerated: planRes.rows.length > 0,
        caloriesBurned: parseInt(statsRes.rows[0].count || '0') * 85
      }, 
      token 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

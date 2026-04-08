import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './api/routes/auth.routes.js';
import userRoutes from './api/routes/user.routes.js';
import planRoutes from './api/routes/plan.routes.js';
import sessionRoutes from './api/routes/session.routes.js';
import analyticsRoutes from './api/routes/analytics.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Main Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/plans', planRoutes);
app.use('/api/v1/sessions', sessionRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

app.get('/', (req, res) => {
  res.send('Asana Aid API is running');
});

export default app;

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import discussionRoutes from './routes/discussions';
import fileRoutes from './routes/files';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: 'database_connection_failed' });
  }
});

app.use('/api', authRoutes);
app.use('/api', projectRoutes);
app.use('/api', discussionRoutes);
app.use('/api', fileRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Portal backend running on port ${PORT}`);
});

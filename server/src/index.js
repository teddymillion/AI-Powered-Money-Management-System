import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './db.js';
import authRoutes    from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';
import summaryRoutes from './routes/summary.js';
import aiRoutes      from './routes/ai.js';
import chatRoutes    from './routes/chat.js';
import profileRoutes from './routes/profile.js';
import goalsRoutes   from './routes/goals.js';
import { requireAuth } from './middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Serve uploaded avatars — path relative to project root (server/)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/auth',         authRoutes);
app.use('/transactions', requireAuth, transactionRoutes);
app.use('/summary',      requireAuth, summaryRoutes);
app.use('/ai-insights',  requireAuth, aiRoutes);
app.use('/ai-chat',      requireAuth, chatRoutes);
app.use('/profile',      requireAuth, profileRoutes);
app.use('/goals',        requireAuth, goalsRoutes);

const port = process.env.PORT || 4000;

connectDB(process.env.MONGODB_URI)
  .then(() => {
    app.listen(port, () => console.log(`API server running on port ${port}`));
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  });

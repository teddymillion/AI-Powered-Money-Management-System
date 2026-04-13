import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connectDB } from './db.js';
import authRoutes       from './routes/auth.js';
import googleAuthRoutes from './routes/google-auth.js';
import transactionRoutes from './routes/transactions.js';
import summaryRoutes    from './routes/summary.js';
import aiRoutes         from './routes/ai.js';
import chatRoutes       from './routes/chat.js';
import profileRoutes    from './routes/profile.js';
import goalsRoutes      from './routes/goals.js';
import { requireAuth }  from './middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure uploads directory exists (needed on Render ephemeral filesystem)
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(passport.initialize());

// Serve uploaded avatars
app.use('/uploads', express.static(uploadsDir));

// Health check — used by Render and uptime pingers to keep server awake
app.get('/health', (req, res) => res.json({ status: 'ok', ts: Date.now() }));

app.use('/auth',         authRoutes);
app.use('/auth/google',  googleAuthRoutes);
app.use('/transactions', requireAuth, transactionRoutes);
app.use('/summary',      requireAuth, summaryRoutes);
app.use('/ai-insights',  requireAuth, aiRoutes);
app.use('/ai-chat',      requireAuth, chatRoutes);
app.use('/profile',      requireAuth, profileRoutes);
app.use('/goals',        requireAuth, goalsRoutes);

const port = process.env.PORT || 4000;

connectDB(process.env.MONGODB_URI)
  .then(() => {
    app.listen(port, '0.0.0.0', () => console.log(`API server running on port ${port}`));
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  });

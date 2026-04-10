import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';
import summaryRoutes from './routes/summary.js';
import aiRoutes from './routes/ai.js';
import chatRoutes from './routes/chat.js';
import { requireAuth } from './middleware/auth.js';

// Temporary check to ensure JWT_SECRET is loaded.
// eslint-disable-next-line no-console
console.log('JWT_SECRET loaded:', Boolean(process.env.JWT_SECRET));

const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/transactions', requireAuth, transactionRoutes);
app.use('/summary', requireAuth, summaryRoutes);
app.use('/ai-insights', requireAuth, aiRoutes);
app.use('/ai-chat', requireAuth, chatRoutes);

const port = process.env.PORT || 4000;

connectDB(process.env.MONGODB_URI)
  .then(() => {
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`API server running on port ${port}`);
    });
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  });

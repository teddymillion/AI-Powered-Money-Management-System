import { Router } from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import { User } from '../models/User.js';

const router = Router();

// Multer config — store in /uploads, max 2MB
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${req.user.id}-${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed.'));
  },
});

// ── Get profile ────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash -otp -otpExpiry -resetToken -resetExpiry');
    if (!user) return res.status(404).json({ error: 'User not found.' });
    return res.json({ id: user._id, name: user.name, email: user.email, avatar: user.avatar, createdAt: user.createdAt });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

// ── Update name/email ──────────────────────────────────────
router.patch('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    const update = {};
    if (name?.trim()) update.name = name.trim();
    if (email?.trim()) {
      const existing = await User.findOne({ email: email.toLowerCase(), _id: { $ne: req.user.id } });
      if (existing) return res.status(409).json({ error: 'Email already in use.' });
      update.email = email.toLowerCase().trim();
    }
    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select('-passwordHash');
    return res.json({ id: user._id, name: user.name, email: user.email, avatar: user.avatar });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// ── Change password ────────────────────────────────────────
router.post('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New passwords do not match.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }
    const user = await User.findById(req.user.id);
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect.' });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to change password.' });
  }
});

// ── Upload avatar ──────────────────────────────────────────
router.post('/avatar', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
    const avatarUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user.id, { avatar: avatarUrl }, { new: true });
    return res.json({ avatar: user.avatar });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to upload avatar.' });
  }
});

// ── Get notifications ──────────────────────────────────────
router.get('/notifications', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('notifications');
    const sorted = (user.notifications || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(sorted);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
});

// ── Mark notification read ─────────────────────────────────
router.patch('/notifications/:id/read', async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.user.id, 'notifications.id': req.params.id },
      { $set: { 'notifications.$.read': true } }
    );
    return res.json({ message: 'Marked as read.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to mark notification.' });
  }
});

// ── Mark all read ──────────────────────────────────────────
router.patch('/notifications/read-all', async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.user.id },
      { $set: { 'notifications.$[].read': true } }
    );
    return res.json({ message: 'All marked as read.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to mark all.' });
  }
});

// ── Real-time notifications via SSE ──────────────────────
// Map of userId -> res (SSE response)
const sseClients = new Map();

export function pushNotification(userId, notification) {
  const client = sseClients.get(String(userId));
  if (client) {
    client.write(`data: ${JSON.stringify(notification)}\n\n`);
  }
}

router.get('/notifications/stream', async (req, res) => {
  // EventSource can't send headers — accept token via query param
  const token = req.query.token;
  if (!token) return res.status(401).json({ error: 'Missing token.' });

  let userId;
  try {
    const { default: jwt } = await import('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = String(decoded.sub);
  } catch {
    return res.status(401).json({ error: 'Invalid token.' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sseClients.set(userId, res);

  // Heartbeat every 25s to keep connection alive through proxies
  const heartbeat = setInterval(() => res.write(': heartbeat\n\n'), 25000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients.delete(userId);
  });
});

// ── Delete account ────────────────────────────────────────
router.delete('/account', async (req, res) => {
  try {
    const { Transaction } = await import('../models/Transaction.js');
    const { Goal }        = await import('../models/Goal.js');
    await Promise.all([
      Transaction.deleteMany({ userId: req.user.id }),
      Goal.deleteMany({ userId: req.user.id }),
      User.findByIdAndDelete(req.user.id),
    ]);
    return res.json({ message: 'Account deleted successfully.' });
  } catch (error) {
    console.error('Delete account error:', error);
    return res.status(500).json({ error: 'Failed to delete account.' });
  }
});

export default router;

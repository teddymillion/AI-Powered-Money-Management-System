import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Simulate email — logs to console (replace with nodemailer in production)
async function sendEmail({ to, subject, text }) {
  console.log(`\n📧 EMAIL TO: ${to}\nSUBJECT: ${subject}\n${text}\n`);
  // To use real email, configure nodemailer here:
  // const transporter = nodemailer.createTransport({ ... });
  // await transporter.sendMail({ from, to, subject, text });
}

// ── Register ──────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already in use.' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    const token = signToken(user);

    return res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to register user.' });
  }
});

// ── Step 1: Login — send OTP ──────────────────────────────
router.post('/login/request-otp', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials.' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await user.save();

    await sendEmail({
      to: email,
      subject: 'ስሙኒ ዋሌት — Your Login OTP',
      text: `Your one-time password is: ${otp}\n\nThis code expires in 10 minutes.\n\nIf you did not request this, please ignore this email.`,
    });

    return res.json({ message: 'OTP sent to your email.', email });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send OTP.' });
  }
});

// ── Step 2: Login — verify OTP ────────────────────────────
router.post('/login/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required.' });

    const user = await User.findOne({ email });
    if (!user || !user.otp || !user.otpExpiry) {
      return res.status(400).json({ error: 'No OTP found. Please request a new one.' });
    }
    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }
    if (user.otp !== otp.trim()) {
      return res.status(400).json({ error: 'Invalid OTP.' });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = signToken(user);
    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to verify OTP.' });
  }
});

// ── Forgot password — send reset link ─────────────────────
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required.' });

    const user = await User.findOne({ email });
    // Always return success to prevent email enumeration
    if (!user) return res.json({ message: 'If that email exists, a reset link has been sent.' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const resetUrl = `${process.env.CLIENT_ORIGIN || 'http://localhost:3000'}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    await sendEmail({
      to: email,
      subject: 'ስሙኒ ዋሌት — Reset Your Password',
      text: `Click the link below to reset your password:\n\n${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you did not request this, please ignore this email.`,
    });

    return res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send reset email.' });
  }
});

// ── Reset password ─────────────────────────────────────────
router.post('/reset-password', async (req, res) => {
  try {
    const { email, token, password, confirmPassword } = req.body;
    if (!email || !token || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const user = await User.findOne({ email });
    if (!user || user.resetToken !== token || !user.resetExpiry || new Date() > user.resetExpiry) {
      return res.status(400).json({ error: 'Invalid or expired reset link.' });
    }

    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.resetExpiry = null;
    await user.save();

    return res.json({ message: 'Password reset successfully. You can now sign in.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to reset password.' });
  }
});

// ── Resend OTP ─────────────────────────────────────────────
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmail({
      to: email,
      subject: 'ስሙኒ ዋሌት — New OTP',
      text: `Your new one-time password is: ${otp}\n\nExpires in 10 minutes.`,
    });

    return res.json({ message: 'New OTP sent.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to resend OTP.' });
  }
});

// ── Get current user ───────────────────────────────────────
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash -otp -otpExpiry -resetToken -resetExpiry');
    if (!user) return res.status(404).json({ error: 'User not found.' });
    return res.json({ id: user._id, name: user.name, email: user.email, avatar: user.avatar, notifications: user.notifications });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch user.' });
  }
});

export default router;

import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { User } from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import { pushNotification } from '../utils/notificationBus.js';

const router = Router();

// ── Notification helper ────────────────────────────────────
async function sendNotification(userId, notif) {
  await User.findByIdAndUpdate(userId, {
    $push: { notifications: { $each: [notif], $position: 0 } },
  });
  pushNotification(userId, notif);
}

// ── Email sender: Brevo SMTP (IPv4, works on Render free tier) ──
async function sendEmail({ to, subject, html }) {
  if (!process.env.BREVO_USER || !process.env.BREVO_PASS) {
    // Fallback: log so admin can retrieve OTP/reset URL from Render logs
    console.log(`📧 [EMAIL NOT CONFIGURED] TO: ${to}`);
    throw new Error('Email not configured');
  }
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.BREVO_USER,
      pass: process.env.BREVO_PASS,
    },
  });
  await transporter.sendMail({
    from: `"ስሙኒ ዋሌት" <${process.env.BREVO_USER}>`,
    to,
    subject,
    html,
  });
  console.log('✅ Email sent via Brevo to', to);
}

// ── Token + OTP helpers ────────────────────────────────────
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

function otpEmailHtml(firstName, otp) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;background:#0f1117;border-radius:16px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#10b981,#059669);padding:32px;text-align:center">
        <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700">ስሙኒ ዋሌት</h1>
        <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px">AI-Powered Money Management</p>
      </div>
      <div style="padding:32px">
        <h2 style="color:#f5f5f5;font-size:20px;margin:0 0 8px">Your Verification Code</h2>
        <p style="color:#94a3b8;font-size:14px;margin:0 0 24px">Hi ${firstName}! Use this code to verify your account. Expires in <strong style="color:#f5f5f5">10 minutes</strong>.</p>
        <div style="background:#1a1d27;border:2px solid #10b981;border-radius:12px;padding:24px;text-align:center;margin:0 0 24px">
          <span style="font-size:40px;font-weight:900;letter-spacing:12px;color:#10b981">${otp}</span>
        </div>
        <p style="color:#64748b;font-size:12px;margin:0">If you did not request this, ignore this email.</p>
      </div>
      <div style="background:#0a0c12;padding:16px;text-align:center">
        <p style="color:#475569;font-size:11px;margin:0">&copy; ${new Date().getFullYear()} ስሙኒ ዋሌት &mdash; Built by Teddy</p>
      </div>
    </div>
  `;
}

// ── Register ───────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    if (password !== confirmPassword)
      return res.status(400).json({ error: 'Passwords do not match.' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });

    const existing = await User.findOne({ email });

    if (existing && existing.isVerified)
      return res.status(409).json({ error: 'An account with this email already exists. Please sign in.' });

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    if (existing && !existing.isVerified) {
      existing.name = name;
      existing.passwordHash = await bcrypt.hash(password, 10);
      existing.otp = otp;
      existing.otpExpiry = otpExpiry;
      await existing.save();
      sendEmail({ to: email, subject: 'ስሙኒ ዋሌት — Verify Your Email', html: otpEmailHtml(name.split(' ')[0], otp) })
        .catch(err => { console.error('❌ OTP email failed:', err.message); console.log('🔑 OTP for', email, ':', otp); });
      return res.status(201).json({ message: 'Verification code resent. Check your email.', email });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email, passwordHash, otp, otpExpiry, isVerified: false,
      notifications: [{
        id: `welcome-${Date.now()}`,
        title: '🎉 Welcome to ስሙኒ ዋሌት!',
        message: `Hi ${name.split(' ')[0]}! Your account is ready. Start by adding your first transaction.`,
        type: 'success', read: false, createdAt: new Date(),
      }],
    });

    sendEmail({ to: email, subject: 'ስሙኒ ዋሌት — Verify Your Email', html: otpEmailHtml(name.split(' ')[0], otp) })
      .catch(err => { console.error('❌ OTP email failed:', err.message); console.log('🔑 OTP for', email, ':', otp); });

    return res.status(201).json({ message: 'Account created. Check your email for the verification code.', email: user.email });
  } catch (error) {
    console.error('Register error:', error.message);
    return res.status(500).json({ error: 'Failed to register user.' });
  }
});

// ── Login ──────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required.' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: 'No account found with this email. Please register first.' });
    if (!user.isVerified)
      return res.status(403).json({ error: 'Please verify your email first. Check your inbox for the OTP code.' });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid)
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });

    const token = signToken(user);
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to login.' });
  }
});

// ── Request OTP (login step 1) ─────────────────────────────
router.post('/login/request-otp', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials.' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    sendEmail({ to: email, subject: 'ስሙኒ ዋሌት — Your Login OTP', html: otpEmailHtml(user.name.split(' ')[0], otp) })
      .catch(err => { console.error('❌ Login OTP email failed:', err.message); console.log('🔑 OTP for', email, ':', otp); });

    return res.json({ message: 'OTP sent to your email.', email });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send OTP.' });
  }
});

// ── Verify OTP ─────────────────────────────────────────────
router.post('/login/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ error: 'Email and OTP are required.' });

    const user = await User.findOne({ email });
    if (!user || !user.otp || !user.otpExpiry)
      return res.status(400).json({ error: 'No OTP found. Please request a new one.' });
    if (new Date() > user.otpExpiry)
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    if (user.otp !== otp.trim())
      return res.status(400).json({ error: 'Invalid OTP.' });

    user.otp = null;
    user.otpExpiry = null;
    user.isVerified = true;
    await user.save();

    sendNotification(user._id, {
      id: `login-${Date.now()}`,
      title: '🔑 New Sign-In Detected',
      message: `Welcome back, ${user.name.split(' ')[0]}! You signed in at ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}.`,
      type: 'info', read: false, createdAt: new Date(),
    }).catch(() => {});

    const token = signToken(user);
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to verify OTP.' });
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

    sendEmail({ to: email, subject: 'ስሙኒ ዋሌት — New Verification Code', html: otpEmailHtml(user.name.split(' ')[0], otp) })
      .catch(err => { console.error('❌ Resend OTP failed:', err.message); console.log('🔑 OTP for', email, ':', otp); });

    return res.json({ message: 'New OTP sent.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to resend OTP.' });
  }
});

// ── Forgot password ────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required.' });

    const user = await User.findOne({ email });
    if (!user) return res.json({ message: 'If that email exists, a reset link has been sent.' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const resetUrl = `${process.env.CLIENT_ORIGIN || 'http://localhost:3000'}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    sendEmail({
      to: email,
      subject: 'ስሙኒ ዋሌት — Reset Your Password',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;background:#0f1117;border-radius:16px;overflow:hidden">
          <div style="background:linear-gradient(135deg,#10b981,#059669);padding:32px;text-align:center">
            <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700">ስሙኒ ዋሌት</h1>
          </div>
          <div style="padding:32px">
            <h2 style="color:#f5f5f5;font-size:20px;margin:0 0 8px">Reset Your Password</h2>
            <p style="color:#94a3b8;font-size:14px;margin:0 0 24px">Click the button below. Link expires in <strong style="color:#f5f5f5">1 hour</strong>.</p>
            <div style="text-align:center;margin:0 0 24px">
              <a href="${resetUrl}" style="display:inline-block;background:#10b981;color:#fff;font-weight:700;font-size:15px;padding:14px 32px;border-radius:12px;text-decoration:none">Reset Password</a>
            </div>
            <p style="color:#10b981;font-size:11px;word-break:break-all;margin:0">${resetUrl}</p>
          </div>
          <div style="background:#0a0c12;padding:16px;text-align:center">
            <p style="color:#475569;font-size:11px;margin:0">&copy; ${new Date().getFullYear()} ስሙኒ ዋሌት &mdash; Built by Teddy</p>
          </div>
        </div>
      `,
    }).catch(err => { console.error('❌ Reset email failed:', err.message); console.log('🔗 Reset URL for', email, ':', resetUrl); });

    return res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error.message);
    return res.status(500).json({ error: 'Failed to process request.' });
  }
});

// ── Reset password ─────────────────────────────────────────
router.post('/reset-password', async (req, res) => {
  try {
    const { email, token, password, confirmPassword } = req.body;
    if (!email || !token || !password)
      return res.status(400).json({ error: 'All fields are required.' });
    if (password !== confirmPassword)
      return res.status(400).json({ error: 'Passwords do not match.' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });

    const user = await User.findOne({ email });
    if (!user || user.resetToken !== token || !user.resetExpiry || new Date() > user.resetExpiry)
      return res.status(400).json({ error: 'Invalid or expired reset link.' });

    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.resetExpiry = null;
    await user.save();

    return res.json({ message: 'Password reset successfully. You can now sign in.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to reset password.' });
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

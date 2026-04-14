import { Router } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = Router();

passport.use(new GoogleStrategy(
  {
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  `${process.env.SERVER_URL || 'http://localhost:4000'}/auth/google/callback`,
  },
  async (_accessToken, _refreshToken, profile, done) => {
    try {
      const email  = profile.emails?.[0]?.value?.toLowerCase();
      const name   = profile.displayName || 'Google User';
      const avatar = profile.photos?.[0]?.value || null;

      if (!email) return done(new Error('No email from Google'), null);

      // Find existing or create new user
      let user = await User.findOne({ email });

      if (!user) {
        // New user via Google — no password needed, mark as verified
        user = await User.create({
          name,
          email,
          passwordHash: 'GOOGLE_OAUTH', // placeholder, can never be used to login with password
          avatar,
          isVerified: true,
        });
      } else {
        // Update avatar if they didn't set one manually
        if (!user.avatar && avatar) {
          user.avatar = avatar;
          await user.save();
        }
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// Step 1 — redirect to Google
router.get('/', passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
}));

// Step 2 — Google redirects back here
router.get('/callback',
  (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user) => {
      if (err || !user) {
        console.error('Google OAuth error:', err?.message || 'No user returned');
        return res.redirect(`${process.env.CLIENT_ORIGIN || 'http://localhost:3000'}/login?error=google_failed`);
      }

      const token = jwt.sign(
        { sub: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const userData = encodeURIComponent(JSON.stringify({
        id:     user._id,
        name:   user.name,
        email:  user.email,
        avatar: user.avatar,
      }));

      const redirectUrl = `${process.env.CLIENT_ORIGIN || 'http://localhost:3000'}/login?token=${token}&user=${userData}`;
      console.log('Google OAuth success, redirecting to:', redirectUrl.substring(0, 60) + '...');
      return res.redirect(redirectUrl);
    })(req, res, next);
  }
);

export default router;

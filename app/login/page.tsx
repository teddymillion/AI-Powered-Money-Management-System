'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, Shield, TrendingUp, Sparkles, RefreshCw } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { api, APIError } from '@/lib/api';
import { FinanceIllustration } from '@/components/finance-illustration';

type Screen = 'login' | 'register' | 'otp' | 'forgot' | 'forgot-sent';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [screen, setScreen] = useState<Screen>('login');
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [otp, setOtp]             = useState(['', '', '', '', '', '']);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [success, setSuccess]     = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    document.documentElement.classList.toggle('dark', stored !== 'light');
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const reset = () => { setError(null); setSuccess(null); };

  // ── Register ──
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); reset();
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      const data = await api.register(name, email, password, confirm) as any;
      login(data.token, data.user);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof APIError ? err.message : 'Registration failed.');
    } finally { setLoading(false); }
  };

  // ── Login step 1: request OTP ──
  const handleLoginRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault(); reset();
    setLoading(true);
    try {
      await api.requestOTP(email, password);
      setScreen('otp');
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(err instanceof APIError ? err.message : 'Login failed.');
    } finally { setLoading(false); }
  };

  // ── Login step 2: verify OTP ──
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault(); reset();
    const code = otp.join('');
    if (code.length < 6) { setError('Enter the 6-digit code.'); return; }
    setLoading(true);
    try {
      const data = await api.verifyOTP(email, code) as any;
      login(data.token, data.user);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof APIError ? err.message : 'Invalid OTP.');
    } finally { setLoading(false); }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    try {
      await api.resendOTP(email);
      setResendTimer(60);
      setSuccess('New OTP sent to your email.');
    } catch { setError('Failed to resend OTP.'); }
  };

  // ── OTP input handling ──
  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };
  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  // ── Forgot password ──
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault(); reset();
    setLoading(true);
    try {
      await api.forgotPassword(email);
      setScreen('forgot-sent');
    } catch (err) {
      setError(err instanceof APIError ? err.message : 'Failed to send reset email.');
    } finally { setLoading(false); }
  };

  const inputCls = "w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm";

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-accent via-accent/80 to-emerald-700 flex-col justify-between p-12 overflow-hidden">
        <div className="absolute top-[-80px] left-[-80px] w-[420px] h-[420px] rounded-full bg-white/10 blur-3xl animate-blob" />
        <div className="absolute bottom-[-80px] right-[-60px] w-[360px] h-[360px] rounded-full bg-white/10 blur-2xl animate-blob animation-delay-2000" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">ስሙኒ ዋሌት</span>
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center py-6">
          <div className="w-full max-w-[460px]"><FinanceIllustration /></div>
        </div>

        <div className="relative z-10 space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-white leading-snug">Your money, intelligently managed.</h2>
            <p className="text-white/70 text-sm mt-2">AI insights, real-time tracking, and smart budgeting.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs text-white/85">
            {[
              { icon: TrendingUp, text: 'Real-time analytics' },
              { icon: Sparkles,   text: 'AI powered by Llama 3.3' },
              { icon: Shield,     text: 'OTP secured login' },
              { icon: Shield,     text: 'Bank-grade privacy' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3 h-3 text-white" />
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>
          <p className="text-white/30 text-xs">© 2025 ስሙኒ ዋሌት. All rights reserved.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-6 animate-fade-up">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">ስሙኒ ዋሌት</span>
          </div>

          {/* ── LOGIN ── */}
          {screen === 'login' && (
            <>
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-1">Welcome back</h2>
                <p className="text-muted-foreground text-sm">Sign in — we'll send you a verification code</p>
              </div>
              <div className="flex p-1 bg-secondary rounded-xl">
                {(['login', 'register'] as const).map(m => (
                  <button key={m} onClick={() => { setScreen(m); reset(); }}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${screen === m ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                    {m === 'login' ? 'Sign In' : 'Register'}
                  </button>
                ))}
              </div>
              <form onSubmit={handleLoginRequestOTP} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Password</label>
                    <button type="button" onClick={() => { setScreen('forgot'); reset(); }} className="text-xs text-accent hover:underline">Forgot password?</button>
                  </div>
                  <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className={inputCls} />
                </div>
                {error && <div className="flex gap-2 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm"><span>⚠</span><span>{error}</span></div>}
                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 active:scale-[0.98] transition-all disabled:opacity-60 shadow-lg shadow-accent/25">
                  {loading ? <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" /> : <><span>Continue</span><ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            </>
          )}

          {/* ── REGISTER ── */}
          {screen === 'register' && (
            <>
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-1">Create account</h2>
                <p className="text-muted-foreground text-sm">Start managing your finances smarter</p>
              </div>
              <div className="flex p-1 bg-secondary rounded-xl">
                {(['login', 'register'] as const).map(m => (
                  <button key={m} onClick={() => { setScreen(m); reset(); }}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${screen === m ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                    {m === 'login' ? 'Sign In' : 'Register'}
                  </button>
                ))}
              </div>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <input type="text" placeholder="Abebe Kebede" value={name} onChange={e => setName(e.target.value)} required className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <input type="password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Confirm Password</label>
                  <input type="password" placeholder="Repeat your password" value={confirm} onChange={e => setConfirm(e.target.value)} required className={inputCls} />
                  {confirm && password !== confirm && <p className="text-xs text-destructive mt-1">Passwords do not match</p>}
                </div>
                {error && <div className="flex gap-2 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm"><span>⚠</span><span>{error}</span></div>}
                <button type="submit" disabled={loading || (!!confirm && password !== confirm)} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 active:scale-[0.98] transition-all disabled:opacity-60 shadow-lg shadow-accent/25">
                  {loading ? <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" /> : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            </>
          )}

          {/* ── OTP ── */}
          {screen === 'otp' && (
            <>
              <button onClick={() => { setScreen('login'); reset(); }} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-1">Check your email</h2>
                <p className="text-muted-foreground text-sm">We sent a 6-digit code to <strong className="text-foreground">{email}</strong></p>
              </div>
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="flex gap-3 justify-center">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { otpRefs.current[i] = el; }}
                      type="text" inputMode="numeric" maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-secondary border-2 border-border text-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all"
                    />
                  ))}
                </div>
                {error   && <div className="flex gap-2 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm"><span>⚠</span><span>{error}</span></div>}
                {success && <div className="px-4 py-3 rounded-xl bg-accent/10 border border-accent/20 text-accent text-sm">{success}</div>}
                <button type="submit" disabled={loading || otp.join('').length < 6} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 active:scale-[0.98] transition-all disabled:opacity-60 shadow-lg shadow-accent/25">
                  {loading ? <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" /> : 'Verify & Sign In'}
                </button>
                <div className="text-center">
                  <button type="button" onClick={handleResendOTP} disabled={resendTimer > 0}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto disabled:opacity-50">
                    <RefreshCw className="w-3.5 h-3.5" />
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* ── FORGOT PASSWORD ── */}
          {screen === 'forgot' && (
            <>
              <button onClick={() => { setScreen('login'); reset(); }} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to sign in
              </button>
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-1">Forgot password?</h2>
                <p className="text-muted-foreground text-sm">Enter your email and we'll send a reset link.</p>
              </div>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required className={inputCls} />
                </div>
                {error && <div className="flex gap-2 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm"><span>⚠</span><span>{error}</span></div>}
                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 active:scale-[0.98] transition-all disabled:opacity-60 shadow-lg shadow-accent/25">
                  {loading ? <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" /> : <><span>Send Reset Link</span><ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            </>
          )}

          {/* ── FORGOT SENT ── */}
          {screen === 'forgot-sent' && (
            <div className="text-center space-y-6 py-8">
              <div className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Check your inbox</h2>
                <p className="text-muted-foreground text-sm">
                  If <strong className="text-foreground">{email}</strong> exists, a password reset link has been sent. Check your spam folder too.
                </p>
              </div>
              <p className="text-xs text-muted-foreground bg-secondary rounded-xl px-4 py-3">
                💡 The reset link expires in 1 hour. Check the server console for the link (email not configured in dev mode).
              </p>
              <button onClick={() => { setScreen('login'); reset(); }} className="flex items-center gap-1.5 text-sm text-accent hover:underline mx-auto">
                <ArrowLeft className="w-4 h-4" /> Back to sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

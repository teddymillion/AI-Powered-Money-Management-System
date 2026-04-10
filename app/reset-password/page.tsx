'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Lock } from 'lucide-react';
import { api, APIError } from '@/lib/api';
import Link from 'next/link';

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token  = params.get('token') || '';
  const email  = params.get('email') || '';

  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [done, setDone]           = useState(false);

  const inputCls = "w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true); setError(null);
    try {
      await api.resetPassword(email, token, password, confirm);
      setDone(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
      setError(err instanceof APIError ? err.message : 'Failed to reset password.');
    } finally { setLoading(false); }
  };

  if (!token || !email) {
    return (
      <div className="text-center space-y-4">
        <p className="text-destructive">Invalid reset link.</p>
        <Link href="/login" className="text-accent hover:underline text-sm">Back to sign in</Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <Link href="/login" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to sign in
      </Link>

      <div>
        <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 text-accent" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-1">Reset password</h2>
        <p className="text-muted-foreground text-sm">Enter your new password for <strong className="text-foreground">{email}</strong></p>
      </div>

      {done ? (
        <div className="px-4 py-4 rounded-xl bg-accent/10 border border-accent/20 text-accent text-sm text-center">
          ✓ Password reset successfully! Redirecting to sign in...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">New Password</label>
            <input type="password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Confirm Password</label>
            <input type="password" placeholder="Repeat new password" value={confirm} onChange={e => setConfirm(e.target.value)} required className={inputCls} />
            {confirm && password !== confirm && <p className="text-xs text-destructive mt-1">Passwords do not match</p>}
          </div>
          {error && <div className="flex gap-2 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm"><span>⚠</span><span>{error}</span></div>}
          <button type="submit" disabled={loading || (!!confirm && password !== confirm)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 active:scale-[0.98] transition-all disabled:opacity-60 shadow-lg shadow-accent/25">
            {loading ? <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" /> : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    document.documentElement.classList.toggle('dark', stored !== 'light');
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Suspense fallback={<div className="text-muted-foreground text-sm">Loading...</div>}>
        <ResetForm />
      </Suspense>
    </div>
  );
}

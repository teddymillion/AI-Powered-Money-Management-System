'use client';

import { useEffect, useRef, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useAuth } from '@/lib/auth-context';
import { api, APIError } from '@/lib/api';
import { Camera, Check, Lock, Mail, User, Calendar, Loader2 } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName]   = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg]         = useState<{ type: 'success'|'error'; text: string } | null>(null);

  const [curPwd, setCurPwd]   = useState('');
  const [newPwd, setNewPwd]   = useState('');
  const [conPwd, setConPwd]   = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg]         = useState<{ type: 'success'|'error'; text: string } | null>(null);

  const [avatarLoading, setAvatarLoading] = useState(false);
  const [joinedAt, setJoinedAt]           = useState<string | null>(null);

  useEffect(() => {
    api.getProfile().then((p: any) => {
      setName(p.name);
      setEmail(p.email);
      setJoinedAt(p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null);
    }).catch(() => {});
  }, []);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true); setProfileMsg(null);
    try {
      const updated = await api.updateProfile({ name, email }) as any;
      updateUser({ name: updated.name, email: updated.email });
      setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err instanceof APIError ? err.message : 'Failed to update profile.' });
    } finally { setProfileLoading(false); }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd !== conPwd) { setPwdMsg({ type: 'error', text: 'New passwords do not match.' }); return; }
    setPwdLoading(true); setPwdMsg(null);
    try {
      await api.changePassword(curPwd, newPwd, conPwd);
      setPwdMsg({ type: 'success', text: 'Password changed successfully.' });
      setCurPwd(''); setNewPwd(''); setConPwd('');
    } catch (err) {
      setPwdMsg({ type: 'error', text: err instanceof APIError ? err.message : 'Failed to change password.' });
    } finally { setPwdLoading(false); }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarLoading(true);
    try {
      const res = await api.uploadAvatar(file) as any;
      updateUser({ avatar: res.avatar });
    } catch { /* silent */ }
    finally { setAvatarLoading(false); }
  };

  const avatarSrc = user?.avatar ? `${API_BASE}${user.avatar}` : null;
  const initials  = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const inputCls  = "w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all text-sm";

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-up">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your account settings</p>
        </div>

        {/* Avatar + basic info */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center text-2xl font-bold text-accent-foreground">
                {avatarSrc
                  ? <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                  : initials
                }
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={avatarLoading}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-accent text-accent-foreground flex items-center justify-center hover:bg-accent/90 transition-all shadow-md"
              >
                {avatarLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              {joinedAt && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                  <Calendar className="w-3 h-3" /> Member since {joinedAt}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit profile */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-foreground">Personal Information</h2>
          </div>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className={`${inputCls} pl-10`} />
              </div>
            </div>
            {profileMsg && (
              <div className={`px-4 py-2.5 rounded-xl text-sm border ${profileMsg.type === 'success' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-destructive/10 border-destructive/20 text-destructive'}`}>
                {profileMsg.type === 'success' && <Check className="w-3.5 h-3.5 inline mr-1.5" />}{profileMsg.text}
              </div>
            )}
            <button type="submit" disabled={profileLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 disabled:opacity-60 transition-all">
              {profileLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Save Changes
            </button>
          </form>
        </div>

        {/* Change password */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-foreground">Change Password</h2>
          </div>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Password</label>
              <input type="password" value={curPwd} onChange={e => setCurPwd(e.target.value)} placeholder="••••••••" required className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">New Password</label>
              <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="Min. 6 characters" required minLength={6} className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Confirm New Password</label>
              <input type="password" value={conPwd} onChange={e => setConPwd(e.target.value)} placeholder="Repeat new password" required className={inputCls} />
              {conPwd && newPwd !== conPwd && <p className="text-xs text-destructive mt-1">Passwords do not match</p>}
            </div>
            {pwdMsg && (
              <div className={`px-4 py-2.5 rounded-xl text-sm border ${pwdMsg.type === 'success' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-destructive/10 border-destructive/20 text-destructive'}`}>
                {pwdMsg.type === 'success' && <Check className="w-3.5 h-3.5 inline mr-1.5" />}{pwdMsg.text}
              </div>
            )}
            <button type="submit" disabled={pwdLoading || (!!conPwd && newPwd !== conPwd)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 disabled:opacity-60 transition-all">
              {pwdLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              Update Password
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

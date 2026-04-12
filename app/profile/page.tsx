'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useAuth } from '@/lib/auth-context';
import { useLang } from '@/lib/language-context';
import { api, APIError } from '@/lib/api';
import { Camera, Check, Lock, Mail, User, Calendar, Loader2, Trash2, AlertTriangle, Eye, EyeOff } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const { t } = useLang();
  const router  = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName]     = useState(user?.name || '');
  const [email, setEmail]   = useState(user?.email || '');
  const [joinedAt, setJoinedAt] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [curPwd, setCurPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [conPwd, setConPwd] = useState('');
  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarKey, setAvatarKey] = useState(0);

  const [showDeleteModal, setShowDeleteModal]     = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteLoading, setDeleteLoading]         = useState(false);
  const [deleteError, setDeleteError]             = useState<string | null>(null);

  useEffect(() => {
    api.getProfile().then((p: any) => {
      setName(p.name); setEmail(p.email);
      if (p.avatar) updateUser({ avatar: p.avatar });
      setJoinedAt(p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null);
    }).catch(() => {});
  }, []);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault(); setProfileLoading(true); setProfileMsg(null);
    try {
      const updated = await api.updateProfile({ name, email }) as any;
      updateUser({ name: updated.name, email: updated.email });
      setProfileMsg({ type: 'success', text: t('profileUpdated') });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err instanceof APIError ? err.message : t('failedUpdateProfile') });
    } finally { setProfileLoading(false); }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd !== conPwd) { setPwdMsg({ type: 'error', text: t('passwordsNoMatch') }); return; }
    setPwdLoading(true); setPwdMsg(null);
    try {
      await api.changePassword(curPwd, newPwd, conPwd);
      setPwdMsg({ type: 'success', text: t('passwordChanged') });
      setCurPwd(''); setNewPwd(''); setConPwd('');
    } catch (err) {
      setPwdMsg({ type: 'error', text: err instanceof APIError ? err.message : t('failedChangePassword') });
    } finally { setPwdLoading(false); }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setAvatarLoading(true);
    try {
      const res = await api.uploadAvatar(file) as any;
      updateUser({ avatar: res.avatar }); setAvatarKey(k => k + 1);
    } catch { /* silent */ }
    finally { setAvatarLoading(false); if (fileRef.current) fileRef.current.value = ''; }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmText !== 'DELETE') { setDeleteError(t('mustTypeDelete')); return; }
    setDeleteLoading(true); setDeleteError(null);
    try {
      await api.deleteAccount();
      // Wipe all app-specific localStorage so a new account starts clean
      ['override_income', 'override_expense', 'insight_hash', 'auth_token', 'user'].forEach(k => localStorage.removeItem(k));
      logout();
      router.push('/');
    }
    catch (err) { setDeleteError(err instanceof APIError ? err.message : t('failedDelete')); }
    finally { setDeleteLoading(false); }
  };

  const avatarSrc = user?.avatar ? `${API_BASE}${user.avatar}?v=${avatarKey}` : null;
  const initials  = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const inputCls  = 'w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all text-sm';

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-up pb-12">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('profileTitle')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('manageAccount')}</p>
        </div>

        {/* Avatar */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center text-2xl font-bold text-accent-foreground ring-2 ring-border">
                {avatarSrc ? (
                  <img key={avatarKey} src={avatarSrc} alt="Profile photo" className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : <span>{initials}</span>}
              </div>
              <button onClick={() => fileRef.current?.click()} disabled={avatarLoading} title={t('changePhoto')}
                className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-xl bg-accent text-accent-foreground flex items-center justify-center hover:bg-accent/90 transition-all shadow-lg shadow-accent/30 disabled:opacity-60">
                {avatarLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
              </button>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleAvatarChange} />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold text-foreground truncate">{user?.name}</p>
              <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
              {joinedAt && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5">
                  <Calendar className="w-3 h-3 flex-shrink-0" />{t('memberSince')} {joinedAt}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">{t('jpgPngWebp')}</p>
            </div>
          </div>
        </div>

        {/* Personal info */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-foreground">{t('personalInfo')}</h2>
          </div>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('fullName')}</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder={t('fullNamePlaceholder')} required className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('emailAddress')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className={`${inputCls} pl-10`} />
              </div>
            </div>
            {profileMsg && (
              <div className={`px-4 py-2.5 rounded-xl text-sm border flex items-center gap-2 ${profileMsg.type === 'success' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-destructive/10 border-destructive/20 text-destructive'}`}>
                {profileMsg.type === 'success' ? <Check className="w-3.5 h-3.5 flex-shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />}
                {profileMsg.text}
              </div>
            )}
            <button type="submit" disabled={profileLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 disabled:opacity-60 transition-all">
              {profileLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {t('saveChanges')}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-foreground">{t('changePassword')}</h2>
          </div>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('currentPassword')}</label>
              <div className="relative">
                <input type={showCur ? 'text' : 'password'} value={curPwd} onChange={e => setCurPwd(e.target.value)} placeholder="••••••••" required className={`${inputCls} pr-10`} />
                <button type="button" onClick={() => setShowCur(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showCur ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('newPassword')}</label>
              <div className="relative">
                <input type={showNew ? 'text' : 'password'} value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder={t('minSixChars')} required minLength={6} className={`${inputCls} pr-10`} />
                <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('confirmNewPassword')}</label>
              <input type="password" value={conPwd} onChange={e => setConPwd(e.target.value)} placeholder={t('repeatNewPassword')} required className={inputCls} />
              {conPwd && newPwd !== conPwd && (
                <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {t('passwordsNoMatch')}
                </p>
              )}
            </div>
            {pwdMsg && (
              <div className={`px-4 py-2.5 rounded-xl text-sm border flex items-center gap-2 ${pwdMsg.type === 'success' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-destructive/10 border-destructive/20 text-destructive'}`}>
                {pwdMsg.type === 'success' ? <Check className="w-3.5 h-3.5 flex-shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />}
                {pwdMsg.text}
              </div>
            )}
            <button type="submit" disabled={pwdLoading || (!!conPwd && newPwd !== conPwd)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 disabled:opacity-60 transition-all">
              {pwdLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              {t('updatePassword')}
            </button>
          </form>
        </div>

        {/* Danger zone */}
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <h2 className="text-sm font-semibold text-destructive">{t('dangerZone')}</h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">{t('deleteAccount')}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t('deleteAccountDesc')}</p>
            </div>
            <button onClick={() => { setShowDeleteModal(true); setDeleteError(null); setDeleteConfirmText(''); }}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border border-destructive/40 text-destructive text-sm font-semibold hover:bg-destructive hover:text-white transition-all w-full sm:w-auto justify-center sm:justify-start">
              <Trash2 className="w-4 h-4" />{t('delete')}
            </button>
          </div>
        </div>
      </div>

      {/* Delete modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-destructive/15 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-destructive" />
                </div>
                <h3 className="text-base font-bold text-foreground">{t('deleteAccountTitle')}</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {t('deleteAccountWarning')}<strong className="text-foreground">{t('cannotBeUndone')}</strong>
              </p>
            </div>
            <form onSubmit={handleDeleteAccount} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t('typeDeleteToConfirm')}{' '}
                  <span className="font-mono font-bold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded">DELETE</span>
                  {' '}{t('toConfirm')}
                </label>
                <input value={deleteConfirmText} onChange={e => { setDeleteConfirmText(e.target.value); setDeleteError(null); }}
                  placeholder={t('typeDeleteHere')} autoComplete="off" autoFocus
                  className={`w-full px-4 py-3 rounded-xl bg-secondary border-2 text-foreground font-mono text-sm placeholder:text-muted-foreground focus:outline-none transition-all ${deleteConfirmText === 'DELETE' ? 'border-destructive ring-2 ring-destructive/20' : 'border-border focus:border-destructive/50'}`} />
                {deleteConfirmText.length > 0 && deleteConfirmText !== 'DELETE' && (
                  <p className="text-xs text-muted-foreground">
                    {6 - deleteConfirmText.length > 0 ? `${t('keepTyping')} (${deleteConfirmText.length}/6)` : t('mustBeExactly')}
                  </p>
                )}
                {deleteConfirmText === 'DELETE' && (
                  <p className="text-xs text-destructive font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> {t('confirmed')}
                  </p>
                )}
              </div>
              {deleteError && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" /> {deleteError}
                </div>
              )}
              <div className="flex gap-3">
                <button type="button" onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); setDeleteError(null); }} disabled={deleteLoading}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-secondary transition-all">
                  {t('cancel')}
                </button>
                <button type="submit" disabled={deleteLoading || deleteConfirmText !== 'DELETE'}
                  className="flex-1 py-2.5 rounded-xl bg-destructive text-white text-sm font-bold hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]">
                  {deleteLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> {t('deleting')}
                    </span>
                  ) : t('deleteMyAccount')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

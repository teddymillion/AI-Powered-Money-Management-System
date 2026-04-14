'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Send, Sparkles, Wifi } from 'lucide-react';
import { api, APIError } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useLang } from '@/lib/language-context';

interface Message { id: string; role: 'user' | 'assistant'; content: string; isError?: boolean; }

export default function AssistantPage() {
  return (
    <Suspense fallback={null}>
      <AssistantInner />
    </Suspense>
  );
}

function AssistantInner() {
  const { user } = useAuth();
  const { t } = useLang();
  const searchParams = useSearchParams();

  const [messages, setMessages] = useState<Message[]>([{
    id: '1', role: 'assistant', content: t('aiWelcome'),
  }]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const endRef    = useRef<HTMLDivElement>(null);
  const sentRef   = useRef(false); // prevent double-send in StrictMode

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setMessages(p => [...p, { id: Date.now().toString(), role: 'user', content: text }]);
    setInput('');
    setLoading(true);
    try {
      const data = await api.chat(text) as { reply: string };
      setMessages(p => [...p, { id: (Date.now()+1).toString(), role: 'assistant', content: data.reply }]);
    } catch (err) {
      const msg = err instanceof APIError ? err.message : t('failedResponse');
      setMessages(p => [...p, { id: (Date.now()+1).toString(), role: 'assistant', content: `⚠️ ${msg}`, isError: true }]);
    } finally { setLoading(false); }
  };

  // Auto-send insight query from URL param
  useEffect(() => {
    const insight = searchParams.get('insight');
    if (insight && !sentRef.current) {
      sentRef.current = true;
      send(insight);
    }
  }, [searchParams]);

  const PROMPTS = [t('prompt1'), t('prompt2'), t('prompt3'), t('prompt4')];
  const hasInsight = !!searchParams.get('insight');
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const API_BASE  = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const avatarSrc = user?.avatar ? `${API_BASE}${user.avatar}` : null;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-4 animate-fade-up">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t('aiAssistantTitle')}</h1>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                <Wifi className="w-3 h-3" /> LIVE · Llama 3.3
              </span>
            </div>
            <p className="text-sm text-muted-foreground sm:ml-12">{t('aiAssistantSubtitle')}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col" style={{ height: 'min(62vh, calc(100dvh - 220px))' }}>
          <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                {msg.role === 'user' ? (
                  <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0 bg-accent flex items-center justify-center text-xs font-bold text-accent-foreground">
                    {avatarSrc
                      ? <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                      : initials
                    }
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/simuniai.png" alt="ስሙኒ AI" className="w-full h-full object-contain" />
                  </div>
                )}
                <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' ? 'bg-accent text-accent-foreground rounded-tr-sm'
                  : msg.isError ? 'bg-destructive/10 text-destructive border border-destructive/20 rounded-tl-sm'
                  : 'bg-secondary text-foreground border border-border rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/simuniai.png" alt="ስሙኒ AI" className="w-full h-full object-contain" />
                </div>
                <div className="bg-secondary border border-border px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                  {[0,150,300].map(d => (
                    <div key={d} className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {messages.length === 1 && !loading && !hasInsight && (
            <div className="px-5 py-3 border-t border-border bg-secondary/30">
              <p className="text-[11px] text-muted-foreground font-medium mb-2">{t('suggestedQuestions')}</p>
              <div className="flex flex-wrap gap-2">
                {PROMPTS.map(p => (
                  <button key={p} onClick={() => send(p)}
                    className="px-3 py-1.5 text-xs bg-card border border-border text-foreground rounded-xl hover:border-accent/50 hover:text-accent transition-all duration-200">
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-border p-4 bg-card">
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} disabled={loading}
                placeholder={t('askPlaceholder')}
                className="flex-1 px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all" />
              <button type="submit" disabled={!input.trim() || loading}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

import React, { useState, useEffect } from 'react';
import { BookOpen, Send, Sparkles, AlertCircle, CheckCircle2, MessageSquare, Clock } from 'lucide-react';
import {
  GuestbookEntry,
  fetchGuestbookEntries,
  submitGuestbookEntry,
} from '../../services/guestbookService';
import { soundEngine } from '../../utils/soundEffects';

interface GuestbookSectionProps {
  theme: 'day' | 'night';
}

export const GuestbookSection: React.FC<GuestbookSectionProps> = ({ theme }) => {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isShared, setIsShared] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [authorName, setAuthorName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      const res = await fetchGuestbookEntries();
      if (isMounted) {
        setEntries(res.entries);
        setIsShared(res.isShared);
        setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessNotice(null);

    if (isSubmitting) return;

    if (!authorName.trim() || authorName.trim().length < 2) {
      setFormError('Please enter a name of at least 2 characters.');
      soundEngine.playErrorBeep();
      return;
    }

    if (!message.trim() || message.trim().length < 3) {
      setFormError('Please enter a note of at least 3 characters.');
      soundEngine.playErrorBeep();
      return;
    }

    setIsSubmitting(true);
    soundEngine.playButtonTick();

    const res = await submitGuestbookEntry(authorName, message);
    setIsSubmitting(false);

    if (res.success && res.entry) {
      setEntries((prev) => [res.entry!, ...prev]);
      setMessage('');
      setSuccessNotice('Your dream note has been pinned to the Midnight Nursery board! ✨');
      soundEngine.playSuccessChime();
      setTimeout(() => {
        setSuccessNotice(null);
      }, 5000);
    } else {
      setFormError(res.error || 'Failed to submit message. Please try again.');
      soundEngine.playErrorBeep();
    }
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <section id="guestbook" className="py-20 lg:py-24 relative overflow-hidden" aria-labelledby="guestbook-heading">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 liquid-glass-pill px-4 py-1.5 rounded-full text-xs font-semibold text-pink-400 mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Community Starlight Notes</span>
          </div>
          <h2
            id="guestbook-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif tracking-tight mb-4"
            style={{ color: 'var(--color-text-heading)' }}
          >
            Leave a Bedtime Wish
          </h2>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            Send a sleepy thought, a dream idea, or a kind note to Pip and the dreamers passing through the Midnight Nursery.
          </p>

          {/* Transparent Persistence Mode Badge */}
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono border border-pink-400/20 bg-pink-500/5">
            <span className={`w-2 h-2 rounded-full ${isShared ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span style={{ color: 'var(--color-text-muted)' }}>
              {isShared
                ? 'Status: Live Shared Database Active'
                : 'Status: Local Browser Demo (Shared database not configured)'}
            </span>
          </div>
        </div>

        {/* Content Grid: Form (Left) & Entries Feed (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Submission Form Column */}
          <div className="lg:col-span-5">
            <div className="liquid-glass-card p-6 sm:p-8 rounded-3xl relative overflow-hidden">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <h3 className="text-lg font-bold font-serif" style={{ color: 'var(--color-text-heading)' }}>
                  Write in the Guestbook
                </h3>
              </div>

              {/* Success Notification */}
              {successNotice && (
                <div
                  role="status"
                  aria-live="polite"
                  className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs flex items-start gap-2 animate-fade-in"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  <span>{successNotice}</span>
                </div>
              )}

              {/* Error Notification */}
              {formError && (
                <div
                  role="alert"
                  className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-400/30 text-rose-300 text-xs flex items-start gap-2 animate-fade-in"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label
                      htmlFor="guestbook-author"
                      className="text-xs font-semibold"
                      style={{ color: 'var(--color-text-heading)' }}
                    >
                      Your Name or Dream Alias
                    </label>
                    <span className="text-[10px] font-mono text-slate-400">{authorName.length}/32</span>
                  </div>
                  <input
                    id="guestbook-author"
                    type="text"
                    maxLength={32}
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Luna, Sleepy Bear, Stargazer"
                    className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-white/5 border border-pink-400/20 focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400 transition-all placeholder:text-slate-500"
                    style={{ color: 'var(--color-text-main)' }}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label
                      htmlFor="guestbook-message"
                      className="text-xs font-semibold"
                      style={{ color: 'var(--color-text-heading)' }}
                    >
                      Your Bedtime Message
                    </label>
                    <span className="text-[10px] font-mono text-slate-400">{message.length}/280</span>
                  </div>
                  <textarea
                    id="guestbook-message"
                    rows={4}
                    maxLength={280}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share a sweet dream, favorite lullaby note, or bedtime wish..."
                    className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-white/5 border border-pink-400/20 focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400 transition-all placeholder:text-slate-500 resize-none"
                    style={{ color: 'var(--color-text-main)' }}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !authorName.trim() || !message.trim()}
                  className="w-full liquid-glass-button py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed text-pink-200 hover:text-white"
                  aria-label="Submit guestbook message"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Sending note to Pip...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Pin Note to Midnight Nursery</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Entries Feed Column */}
          <div className="lg:col-span-7">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-xs font-semibold flex items-center gap-2" style={{ color: 'var(--color-text-heading)' }}>
                  <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
                  <span>Starlight Notes ({entries.length})</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {entries.length === 0 ? 'Quiet night' : 'Latest dreams'}
                </span>
              </div>

              {isLoading ? (
                <div className="p-8 text-center text-xs text-slate-400 liquid-glass-card rounded-2xl">
                  <span className="inline-block w-4 h-4 border-2 border-pink-400/30 border-t-pink-400 rounded-full animate-spin mr-2" />
                  Retrieving starlight messages...
                </div>
              ) : entries.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 liquid-glass-card rounded-2xl">
                  No notes left yet tonight. Be the first to pin a wish for Pip! 🌙
                </div>
              ) : (
                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                  {entries.map((entry) => (
                    <article
                      key={entry.id}
                      className="liquid-glass-card p-4 sm:p-5 rounded-2xl transition-all duration-200 hover:border-pink-400/40 relative group"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-8 h-8 rounded-full bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-sm shadow-sm"
                            aria-hidden="true"
                          >
                            {entry.avatarEmoji || '⭐'}
                          </span>
                          <div>
                            <h4
                              className="text-xs sm:text-sm font-bold font-serif leading-tight"
                              style={{ color: 'var(--color-text-heading)' }}
                            >
                              {entry.authorName}
                            </h4>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mt-0.5">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <time dateTime={entry.createdAt}>{formatRelativeTime(entry.createdAt)}</time>
                              {entry.isLocal && (
                                <span className="text-amber-400/80 font-normal">· Local</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <p
                        className="text-xs sm:text-sm leading-relaxed pl-10.5 font-normal break-words"
                        style={{ color: 'var(--color-text-main)' }}
                      >
                        {entry.message}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { Instagram, Linkedin, Github, ExternalLink, X, Sparkles, AlertCircle, Heart } from 'lucide-react';
import { soundEngine } from '../../utils/soundEffects';

interface SocialLink {
  label: string;
  url?: string;
  handle: string;
  isVerified: boolean;
  note?: string;
}

interface DeveloperProfile {
  id: string;
  name: string;
  role: string;
  avatarLetter: string;
  avatarColor: string;
  tagline: string;
  instagram: SocialLink;
  linkedin: SocialLink;
  github: SocialLink;
}

const DEVELOPERS: DeveloperProfile[] = [
  {
    id: 'soumyajit',
    name: 'Soumyajit Guria',
    role: 'Lead Architect & Fullstack',
    avatarLetter: 'S',
    avatarColor: 'from-pink-500 to-rose-600',
    tagline: 'Dream engineering, creative interactive systems, and UI architecture.',
    instagram: {
      label: 'Instagram',
      url: 'https://www.instagram.com/soumya_jit.exe?stkn=MW9zNnR5NW5qMnh3Ng==',
      handle: '@soumya_jit.exe',
      isVerified: true,
    },
    linkedin: {
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/soumyajit005/',
      handle: 'in/soumyajit005',
      isVerified: true,
    },
    github: {
      label: 'GitHub',
      url: 'https://github.com/soumyajitguria005-art',
      handle: 'soumyajitguria005-art',
      isVerified: true,
    },
  },
  {
    id: 'shubhankar',
    name: 'Shubhankar Das',
    role: 'Creative Technologist',
    avatarLetter: 'S',
    avatarColor: 'from-purple-500 to-indigo-600',
    tagline: 'Animation dynamics, soundscapes, and digital worldcrafting.',
    instagram: {
      label: 'Instagram',
      url: 'https://www.instagram.com/shubhankar.d_5?stkn=eGNnd3E5NW13Znk2',
      handle: '@shubhankar.d_5',
      isVerified: true,
    },
    linkedin: {
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/shubhankar05/',
      handle: 'in/shubhankar05',
      isVerified: true,
    },
    github: {
      label: 'GitHub',
      url: 'https://github.com/shubhankarO5',
      handle: 'shubhankarO5',
      isVerified: true,
    },
  },
  {
    id: 'shubham',
    name: 'Shubham Si',
    role: 'Frontend & Interactions',
    avatarLetter: 'S',
    avatarColor: 'from-amber-500 to-pink-500',
    tagline: 'Component craft, playful feedback, and user experience.',
    instagram: {
      label: 'Instagram',
      url: 'https://www.instagram.com/shubham_12.s?stkn=ZHZpa3V0emNtaGs=',
      handle: '@shubham_12.s',
      isVerified: true,
    },
    linkedin: {
      label: 'LinkedIn',
      // Note: Per explicit requirements, LinkedIn profile URL was not configured in project repository.
      // Marked as requiring verified URL rather than fabricating an unverified link.
      handle: 'Requires verified URL',
      isVerified: false,
      note: 'Profile URL pending verification from developer. Instagram & GitHub are active!',
    },
    github: {
      label: 'GitHub',
      url: 'https://github.com/shubham07sipm-netizen',
      handle: 'shubham07sipm-netizen',
      isVerified: true,
    },
  },
];

interface DeveloperBottomBarProps {
  theme?: 'day' | 'night';
}

export const DeveloperBottomBar: React.FC<DeveloperBottomBarProps> = ({ theme = 'night' }) => {
  const [activeDevId, setActiveDevId] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const activeDev = DEVELOPERS.find((d) => d.id === activeDevId);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeDevId) {
        soundEngine.playButtonTick();
        setActiveDevId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDevId]);

  // Focus trap / auto-focus close button when modal opens
  useEffect(() => {
    if (activeDevId && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [activeDevId]);

  // Close when clicking outside modal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setActiveDevId(null);
      }
    };

    if (activeDevId) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }
  }, [activeDevId]);

  const handleOpenProfile = (devId: string) => {
    soundEngine.playButtonTick();
    setActiveDevId(devId);
  };

  const handleClose = () => {
    soundEngine.playButtonTick();
    setActiveDevId(null);
  };

  return (
    <>
      {/* 1. INTEGRATED FOOTER DEVELOPER ROW */}
      <div
        data-cursor-exclude="true"
        aria-label="Developer Attribution & Credits"
        className="w-full flex items-center justify-center select-none pt-1"
      >
        <div className="liquid-glass-pill px-3.5 py-1.5 sm:px-4 sm:py-1 rounded-full flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2.5 text-xs border border-pink-400/25 bg-slate-950/70 shadow-xs">
          {/* Main Attribution Line */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center text-[11px]">
            <span className="flex items-center gap-1 text-pink-300/80 font-medium whitespace-nowrap">
              <span>Made with magic by</span>
              <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
            </span>

            {/* Clickable Developer Names */}
            <div className="flex items-center gap-1 flex-wrap justify-center">
              {DEVELOPERS.map((dev, idx) => (
                <React.Fragment key={dev.id}>
                  <button
                    type="button"
                    onClick={() => handleOpenProfile(dev.id)}
                    aria-label={`View ${dev.name}'s social links`}
                    aria-expanded={activeDevId === dev.id}
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 ${
                      activeDevId === dev.id
                        ? 'bg-pink-500/30 text-white border border-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.5)]'
                        : 'text-pink-100 hover:text-white bg-white/5 hover:bg-pink-500/20 border border-pink-400/20 hover:border-pink-400/40 active:scale-95'
                    }`}
                  >
                    {dev.name}
                  </button>
                  {idx < DEVELOPERS.length - 1 && (
                    <span className="text-pink-400/40 text-[10px]">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Subtle Separator on Desktop */}
          <span className="hidden sm:inline text-pink-400/30 text-[10px]">|</span>

          {/* Team Expo Tagline */}
          <div className="text-[10px] text-amber-300/90 font-mono tracking-tight shrink-0 flex items-center gap-1">
            <span>Team Expo</span>
            <span className="text-pink-400/50">·</span>
            <span className="text-slate-300">Dreamers behind the magic</span>
            <span>✨</span>
          </div>
        </div>
      </div>

      {/* 2. DEVELOPER PROFILE POPOVER / MODAL */}
      {activeDev && (
        <div
          data-cursor-exclude="true"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`dev-modal-title-${activeDev.id}`}
        >
          <div
            ref={popoverRef}
            className="w-full max-w-sm rounded-3xl p-5 sm:p-6 liquid-glass border border-pink-400/40 bg-slate-950/95 shadow-[0_16px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(244,114,182,0.25)] text-slate-100 relative transform transition-all duration-200"
          >
            {/* Close Button */}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white bg-white/5 hover:bg-pink-500/25 border border-slate-700/50 hover:border-pink-400/40 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300"
              aria-label="Close profile modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Profile Header */}
            <div className="flex items-center gap-3.5 mb-4">
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${activeDev.avatarColor} flex items-center justify-center text-white text-lg font-bold shadow-md border border-white/20`}
              >
                {activeDev.avatarLetter}
              </div>
              <div className="pr-6">
                <div className="flex items-center gap-1.5">
                  <h3
                    id={`dev-modal-title-${activeDev.id}`}
                    className="text-base font-bold font-serif text-pink-100"
                  >
                    {activeDev.name}
                  </h3>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <p className="text-xs text-pink-300/80 font-medium">{activeDev.role}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Team Expo</p>
              </div>
            </div>

            {/* Tagline */}
            <p className="text-xs text-slate-300/90 mb-4 pb-3 border-b border-pink-400/20 leading-relaxed">
              {activeDev.tagline}
            </p>

            {/* Social Links List */}
            <div className="space-y-2">
              {/* Instagram */}
              <a
                href={activeDev.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundEngine.playButtonTick()}
                className="flex items-center justify-between p-2.5 rounded-2xl liquid-glass-pill hover:border-pink-400/60 hover:bg-pink-500/15 transition-all text-xs group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300"
                aria-label={`${activeDev.name}'s Instagram profile`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center border border-pink-400/30">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-100 group-hover:text-pink-200 transition-colors">
                      Instagram
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {activeDev.instagram.handle}
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-pink-300 transition-colors" />
              </a>

              {/* LinkedIn */}
              {activeDev.linkedin.isVerified && activeDev.linkedin.url ? (
                <a
                  href={activeDev.linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundEngine.playButtonTick()}
                  className="flex items-center justify-between p-2.5 rounded-2xl liquid-glass-pill hover:border-sky-400/60 hover:bg-sky-500/15 transition-all text-xs group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                  aria-label={`${activeDev.name}'s LinkedIn profile`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-400/30">
                      <Linkedin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-100 group-hover:text-sky-200 transition-colors">
                        LinkedIn
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {activeDev.linkedin.handle}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-300 transition-colors" />
                </a>
              ) : (
                <div
                  className="flex items-center justify-between p-2.5 rounded-2xl border border-amber-400/30 bg-amber-500/10 text-xs text-slate-300"
                  title={activeDev.linkedin.note}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
                      <Linkedin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-amber-200 flex items-center gap-1.5">
                        <span>LinkedIn</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase font-semibold">
                          Pending URL
                        </span>
                      </div>
                      <div className="text-[10px] text-amber-300/80 font-mono">
                        Requires verified URL
                      </div>
                    </div>
                  </div>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                </div>
              )}

              {/* GitHub */}
              <a
                href={activeDev.github.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundEngine.playButtonTick()}
                className="flex items-center justify-between p-2.5 rounded-2xl liquid-glass-pill hover:border-purple-400/60 hover:bg-purple-500/15 transition-all text-xs group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
                aria-label={`${activeDev.name}'s GitHub profile`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-400/30">
                    <Github className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-100 group-hover:text-purple-200 transition-colors">
                      GitHub
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {activeDev.github.handle}
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-300 transition-colors" />
              </a>
            </div>

            {/* Bottom Modal Footer */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-pink-300 font-semibold text-[10px]">
                <Heart className="w-3 h-3 fill-pink-400" /> Expo Dream Team
              </span>
              <button
                type="button"
                onClick={handleClose}
                className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
              >
                Press Esc to close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

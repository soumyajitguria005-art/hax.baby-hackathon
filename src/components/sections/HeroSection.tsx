import React from 'react';
import { PipState } from '../../types/character';
import { PipCharacter } from '../character/PipCharacter';
import { ThreeDreamSky } from '../three/ThreeDreamSky';
import { soundEngine } from '../../utils/soundEffects';
import { Sparkles, Moon, Bell, Wand2, Compass, Heart, ArrowDown } from 'lucide-react';
import { TextAnimation, FlipFadeText, FlipText } from '../text';
import { ScrollReveal } from '../effects/ScrollReveal';
import { HeadingReveal } from '../effects/HeadingReveal';

interface HeroSectionProps {
  pipState: PipState;
  onPipStateChange: (state: PipState) => void;
  enableTilt: boolean;
  theme: 'day' | 'night';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  pipState,
  onPipStateChange,
  enableTilt,
  theme,
}) => {
  const handleHearChime = () => {
    soundEngine.playLullabyNote(880, 0.8);
    soundEngine.playStarSparkle();
    onPipStateChange('happy');
  };

  const SHORTCUTS = [
    { label: 'Dream', icon: Moon, desc: 'Lullabies & clouds', href: '#projects' },
    { label: 'Create', icon: Wand2, desc: 'Nightlight craft', href: '#projects' },
    { label: 'Deliver', icon: Compass, desc: 'Rooftop routes', href: '#projects' },
    { label: 'Repeat', icon: Heart, desc: 'Peaceful sleep', href: '#story' },
  ];

  return (
    <section id="hero" className="relative min-h-[85vh] flex items-center justify-center pt-8 pb-16 overflow-hidden">
      {/* Three.js 3D Interactive Parallax Starfield */}
      <ThreeDreamSky theme={theme} />

      {/* Decorative Crescent Moon & Orbit Lines */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] pointer-events-none opacity-30 z-0">
        <svg className="w-full h-full" viewBox="0 0 800 800" fill="none">
          <circle cx="400" cy="400" r="320" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="8 8" />
          <circle cx="400" cy="400" r="240" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4 6" />
          {/* Crescent Moon */}
          <path
            d="M580 240 A120 120 0 1 0 640 380 A100 100 0 1 1 580 240 Z"
            fill="var(--color-gold)"
            opacity="0.35"
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* LEFT: CHARACTER INTRODUCTION & HERO COPY */}
          <ScrollReveal distance={28} duration={750} className="lg:col-span-7 space-y-6 text-left">
            {/* Status Pill with rotating FlipFadeText */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-pill text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span style={{ color: 'var(--color-text-main)' }}>Engineering</span>
              <span aria-hidden="true">·</span>
              <FlipFadeText
                words={["SWEET DREAMS", "STARRY SKIES", "COZY LULLABIES", "WARM NIGHTLIGHTS", "ROOFTOP FLIGHTS"]}
                interval={2600}
                textClassName="text-pink-400 font-bold text-xs"
              />
            </div>

            {/* Headline with HeadingReveal & TextAnimation */}
            <HeadingReveal
              as="h1"
              delay={80}
              className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] font-serif text-balance"
              style={{ color: 'var(--color-text-heading)' }}
            >
              <TextAnimation divideBy="word" delay={0.1}>
                Small Baby. Big Dreams.
              </TextAnimation>
            </HeadingReveal>

            {/* Supporting Introduction */}
            <p
              className="text-base sm:text-lg leading-relaxed max-w-xl"
              style={{ color: 'var(--color-text-main)' }}
            >
              I'm <strong className="font-bold text-pink-400">Pip</strong>, a Junior Dream Engineer at Midnight Nursery. I design dreams, lullabies, nightlights and bedtime stories that help little creatures fall asleep.
            </p>

            {/* Liquid Glass CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#projects"
                className="liquid-glass-button px-6 py-3 rounded-full text-sm font-bold text-white shadow-lg transition-all flex items-center gap-2 group cursor-pointer"
                style={{ backgroundColor: 'var(--color-berry)' }}
              >
                <span>Explore My Dream World</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </a>

              <button
                onClick={handleHearChime}
                className="liquid-glass-button px-5 py-3 rounded-full text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer"
                style={{ color: 'var(--color-text-main)' }}
              >
                <Bell className="w-4 h-4 text-amber-400" />
                <span>Hear a Tiny Chime</span>
              </button>
            </div>

            {/* Mini hint */}
            <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Move your pointer to watch Pip and the 3D starfield gently tilt and follow you.</span>
            </p>
          </ScrollReveal>

          {/* RIGHT: PIP STAGE & LIQUID GLASS SHORTCUT PANEL */}
          <ScrollReveal distance={28} duration={750} delay={120} className="lg:col-span-5 flex flex-col items-center justify-center relative">
            {/* Luminous Glow Behind Character */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500/15 via-amber-300/10 to-transparent blur-3xl pointer-events-none" />

            {/* Pip Character */}
            <div className="relative z-10">
              <PipCharacter
                state={pipState}
                size="xl"
                enableTilt={enableTilt}
                theme={theme}
                showSpeechBubble={true}
                interactive={true}
                onStateChange={onPipStateChange}
              />
            </div>

            {/* Floating Glass Shortcut Panel: Dream, Create, Deliver, Repeat */}
            <div className="mt-6 w-full max-w-md liquid-glass rounded-2xl p-3 grid grid-cols-4 gap-2 text-center shadow-lg">
              {SHORTCUTS.map((sc, scIdx) => {
                const Icon = sc.icon;
                return (
                  <a
                    key={sc.label}
                    href={sc.href}
                    className="p-2 rounded-xl hover:bg-white/20 dark:hover:bg-white/10 transition-colors group flex flex-col items-center"
                  >
                    <Icon className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform mb-1" />
                    <span className="text-xs font-bold font-serif" style={{ color: 'var(--color-text-heading)' }}>
                      <FlipText duration={2.2} delay={scIdx * 0.15}>
                        {sc.label}
                      </FlipText>
                    </span>
                    <span className="text-[10px] text-slate-400 hidden sm:block truncate w-full">
                      {sc.desc}
                    </span>
                  </a>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

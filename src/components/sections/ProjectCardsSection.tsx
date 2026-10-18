import React, { useState, useEffect, useRef } from 'react';
import { PipState } from '../../types/character';
import { soundEngine } from '../../utils/soundEffects';
import { use3DCardTilt } from '../../hooks/use3DCardTilt';
import { ThreeMusicBox } from '../three/ThreeMusicBox';
import { ThreeLantern } from '../three/ThreeLantern';
import { ThreeRooftops } from '../three/ThreeRooftops';
import { Play, Pause, RotateCw, Lightbulb, Send, RotateCcw, Sparkles, Box } from 'lucide-react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { HeadingReveal } from '../effects/HeadingReveal';
import { DreamPath } from '../effects/DreamPath';
import { TextAnimation } from '../text';

interface ProjectCardsSectionProps {
  onPipStateChange: (state: PipState) => void;
  theme: 'day' | 'night';
  isRevealed?: boolean;
}

export const ProjectCardsSection: React.FC<ProjectCardsSectionProps> = ({
  onPipStateChange,
  isRevealed: propIsRevealed,
}) => {
  // Intersection observers with staggered entrance delays
  const sectionObserver = useIntersectionObserver<HTMLElement>({ threshold: 0.1, triggerOnce: true });
  const isSectionRevealed = propIsRevealed !== undefined ? propIsRevealed : sectionObserver.isRevealed;
  const headerObserver = useIntersectionObserver<HTMLDivElement>({ threshold: 0.15, triggerOnce: true });
  const card1Observer = useIntersectionObserver<HTMLDivElement>({ threshold: 0.1, delay: 0, triggerOnce: true });
  const card2Observer = useIntersectionObserver<HTMLDivElement>({ threshold: 0.1, delay: 150, triggerOnce: true });
  const card3Observer = useIntersectionObserver<HTMLDivElement>({ threshold: 0.1, delay: 300, triggerOnce: true });

  // 3D Card Hover Tilt Hooks
  const card1Tilt = use3DCardTilt(8);
  const card2Tilt = use3DCardTilt(8);
  const card3Tilt = use3DCardTilt(8);

  // 3D Flip state for each card
  const [isFlipped1, setIsFlipped1] = useState(false);
  const [isFlipped2, setIsFlipped2] = useState(false);
  const [isFlipped3, setIsFlipped3] = useState(false);

  // 3D Model Mode vs 2D Illustration toggle (allows users to toggle live 3D WebGL viewport!)
  const [is3DMode1, setIs3DMode1] = useState(true);
  const [is3DMode2, setIs3DMode2] = useState(true);
  const [is3DMode3, setIs3DMode3] = useState(true);

  // Card 1: Lullaby Lab State
  const [isPlayingLullaby, setIsPlayingLullaby] = useState(false);
  const [noteProgress, setNoteProgress] = useState(0);
  const musicTimerRef = useRef<number | null>(null);

  // Card 2: Nightlight State
  const [isLanternLit, setIsLanternLit] = useState(true);
  const [selectedLanternColor, setSelectedLanternColor] = useState('#f59e0b');
  const [glowIntensity, setGlowIntensity] = useState(85);

  // Card 3: Dream Delivery Flight State
  const [isDelivering, setIsDelivering] = useState(false);
  const [flightProgress, setFlightProgress] = useState(0);

  // Lullaby synthesizer loop
  useEffect(() => {
    if (!isPlayingLullaby) {
      if (musicTimerRef.current) clearInterval(musicTimerRef.current);
      return;
    }

    const melody = [523.25, 659.25, 783.99, 880.0, 783.99, 659.25];
    let idx = 0;
    onPipStateChange('happy');

    musicTimerRef.current = window.setInterval(() => {
      soundEngine.playLullabyNote(melody[idx % melody.length], 0.7);
      setNoteProgress(idx % melody.length);
      idx++;
    }, 450);

    return () => {
      if (musicTimerRef.current) clearInterval(musicTimerRef.current);
    };
  }, [isPlayingLullaby, onPipStateChange]);

  // Delivery flight animation loop
  useEffect(() => {
    if (!isDelivering) return;
    onPipStateChange('flying');

    const interval = setInterval(() => {
      setFlightProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDelivering(false);
          soundEngine.playStarSparkle();
          onPipStateChange('happy');
          return 100;
        }
        return prev + 4;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isDelivering, onPipStateChange]);

  const togglePlayLullaby = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlayingLullaby(!isPlayingLullaby);
    if (!isPlayingLullaby) {
      soundEngine.playGentlePop();
    }
  };

  const toggleLanternPower = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playLanternClick();
    setIsLanternLit(!isLanternLit);
    onPipStateChange(isLanternLit ? 'idle' : 'excited');
  };

  const startDelivery = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playDreamWhoosh();
    setFlightProgress(0);
    setIsDelivering(true);
  };

  const resetDelivery = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFlightProgress(0);
    setIsDelivering(false);
  };

  return (
    <section
      id="projects"
      ref={sectionObserver.ref}
      className={`py-20 lg:py-28 relative reveal-fade-up ${isSectionRevealed ? 'is-revealed' : ''}`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div
          ref={headerObserver.ref}
          className={`text-center max-w-2xl mx-auto mb-16 space-y-3 transition-all duration-700 ${headerObserver.revealClass}`}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-pill text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span style={{ color: 'var(--color-text-main)' }}>Interactive 3D Showcases</span>
          </div>
          <HeadingReveal
            as="h2"
            delay={80}
            className="text-3xl sm:text-5xl font-bold font-serif tracking-tight"
            style={{ color: 'var(--color-text-heading)' }}
          >
            <TextAnimation divideBy="word">
              Pip's Dream Inventions
            </TextAnimation>
          </HeadingReveal>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            Hover for 3D liquid tilt, drag the interactive Three.js models to inspect them from any angle, or click the card to flip in 3D!
          </p>
        </div>

        {/* 3-Column Grid of 3D Tilt & Flip Project Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ======================================================== */}
          {/* CARD 01 — LULLABY LAB */}
          {/* ======================================================== */}
          <div
            ref={card1Observer.ref}
            className={`h-full transition-all duration-700 reveal-fade-up reveal-delay-150 ${
              isSectionRevealed || card1Observer.isRevealed ? 'is-revealed' : ''
            }`}
          >
            <div
              ref={card1Tilt.ref}
            style={card1Tilt.tiltStyle}
            onPointerMove={card1Tilt.onPointerMove}
            onPointerLeave={card1Tilt.onPointerLeave}
            className="perspective-1000 h-[510px] cursor-pointer group relative"
            onClick={() => setIsFlipped1(!isFlipped1)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsFlipped1(!isFlipped1);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Lullaby Lab Project Card. Press Enter to flip."
          >
            {/* Dynamic Liquid Glare Layer */}
            <div className="absolute inset-0 rounded-3xl z-20 pointer-events-none" style={card1Tilt.glareStyle} />

            <div
              className={`relative w-full h-full transition-transform duration-700 preserve-3d ${
                isFlipped1 ? 'rotate-y-180' : ''
              }`}
            >
              {/* FRONT OF CARD 1 */}
              <div className="absolute inset-0 backface-hidden liquid-glass rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl border border-pink-300/35 overflow-hidden">
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-semibold text-pink-400 font-rounded">Sound Therapy</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIs3DMode1(!is3DMode1);
                        }}
                        className="liquid-glass-pill px-2 py-0.5 text-[10px] font-mono text-pink-300 hover:text-white flex items-center gap-1"
                        title="Toggle 3D WebGL / 2D Vector"
                      >
                        <Box className="w-3 h-3" />
                        <span>{is3DMode1 ? '3D Active' : '2D View'}</span>
                      </button>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400 group-hover:text-pink-300 transition-colors">
                        <RotateCw className="w-3 h-3" /> Flip 3D
                      </span>
                    </div>
                  </div>

                  {/* Artwork Container: Interactive Three.js 3D Music Box */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="w-full h-48 rounded-2xl bg-gradient-to-br from-purple-950/50 via-slate-900/60 to-pink-950/30 border border-purple-500/25 flex items-center justify-center relative overflow-hidden mb-4"
                  >
                    {is3DMode1 ? (
                      <ThreeMusicBox isPlaying={isPlayingLullaby} />
                    ) : (
                      <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none">
                        <rect x="20" y="38" width="60" height="42" rx="8" fill="#7C3AED" stroke="#FBBF24" strokeWidth="2.5" />
                        <rect x="16" y="32" width="68" height="10" rx="4" fill="#6D28D9" />
                        <circle cx="50" cy="58" r="14" fill="#FDE047" opacity="0.9" />
                        <circle cx="50" cy="58" r="7" fill="#7C3AED" />
                        <text x="35" y="24" fill="#F472B6" fontSize="16" className="animate-float-note">♪</text>
                      </svg>
                    )}

                    {/* Waveform indicator */}
                    <div className="absolute bottom-2 left-4 right-4 flex items-center justify-center gap-1 h-4 pointer-events-none">
                      {[8, 16, 12, 20, 14, 10, 18, 9].map((h, i) => (
                        <div
                          key={i}
                          className={`w-1 rounded-full transition-all duration-200 ${
                            isPlayingLullaby ? 'bg-pink-400 shadow-[0_0_6px_#f472b6]' : 'bg-slate-700'
                          }`}
                          style={{ height: isPlayingLullaby ? `${h}px` : '4px' }}
                        />
                      ))}
                    </div>
                  </div>

                  <HeadingReveal
                    as="h3"
                    delay={150}
                    className="text-2xl font-bold font-serif mb-1"
                    style={{ color: 'var(--color-text-heading)' }}
                  >
                    Lullaby Lab
                  </HeadingReveal>
                  <p className="text-xs sm:text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>
                    Generative lullabies for sweeter dreams. Calibrated to release busy daytime tension.
                  </p>
                </div>

                {/* Bottom Interactive Trigger */}
                <div className="pt-3 border-t border-slate-700/30 flex items-center justify-between">
                  <button
                    onClick={togglePlayLullaby}
                    className="liquid-glass-button px-4 py-2 rounded-full text-xs font-bold text-white bg-pink-600/75 hover:bg-pink-600 flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    {isPlayingLullaby ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlayingLullaby ? 'Pause Sound' : 'Play Lullaby'}</span>
                  </button>
                  <span className="text-[11px] text-pink-300 font-semibold font-rounded">Tap to Flip ↻</span>
                </div>
              </div>

              {/* BACK OF CARD 1 */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 liquid-glass rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl border border-pink-400/50">
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-bold text-pink-400 font-serif text-sm">Lullaby Lab Deep Dive</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFlipped1(false);
                      }}
                      className="liquid-glass-pill px-2.5 py-1 text-[11px] text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" /> Back
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Pip tunes harmonic intervals using celestial crystal chimes. Each sequence slows heart rates and gently synchronizes breathing with the night sky.
                  </p>

                  {/* Working Celesta Sequencer Controller */}
                  <div className="liquid-glass rounded-2xl p-4 space-y-3 mb-4">
                    <div className="flex items-center justify-between text-xs text-pink-200">
                      <span>Synthesizer State</span>
                      <span className="font-mono text-[11px] text-amber-300">
                        {isPlayingLullaby ? 'Playing 432Hz Celesta' : 'Paused'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 h-6">
                      {[0, 1, 2, 3, 4, 5].map((idx) => (
                        <div
                          key={idx}
                          className={`flex-1 rounded-sm transition-all duration-150 ${
                            isPlayingLullaby && noteProgress === idx
                              ? 'bg-yellow-300 h-6 shadow-[0_0_8px_#f1c66d]'
                              : 'bg-slate-700 h-2.5'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={togglePlayLullaby}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-pink-600 hover:bg-pink-500 text-white flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        {isPlayingLullaby ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        <span>{isPlayingLullaby ? 'Halt Melody' : 'Play Full Lullaby'}</span>
                      </button>
                      <span className="text-[11px] text-slate-400">Harmonic: Pentatonic</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 text-center border-t border-slate-700/30 pt-3">
                  Click card again to flip to front
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CARD 02 — NIGHTLIGHT COLLECTION */}
        {/* ======================================================== */}
        <div
          ref={card2Observer.ref}
          className={`h-full transition-all duration-700 reveal-fade-up reveal-delay-300 ${
            isSectionRevealed || card2Observer.isRevealed ? 'is-revealed' : ''
          }`}
        >
          <div
            ref={card2Tilt.ref}
            style={card2Tilt.tiltStyle}
            onPointerMove={card2Tilt.onPointerMove}
            onPointerLeave={card2Tilt.onPointerLeave}
            className="perspective-1000 h-[510px] cursor-pointer group relative"
            onClick={() => setIsFlipped2(!isFlipped2)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsFlipped2(!isFlipped2);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Nightlight Collection Project Card. Press Enter to flip."
          >
            <div className="absolute inset-0 rounded-3xl z-20 pointer-events-none" style={card2Tilt.glareStyle} />

            <div
              className={`relative w-full h-full transition-transform duration-700 preserve-3d ${
                isFlipped2 ? 'rotate-y-180' : ''
              }`}
            >
              {/* FRONT OF CARD 2 */}
              <div className="absolute inset-0 backface-hidden liquid-glass rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl border border-amber-300/35 overflow-hidden">
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-semibold text-amber-400 font-rounded">Nursery Luminescence</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIs3DMode2(!is3DMode2);
                        }}
                        className="liquid-glass-pill px-2 py-0.5 text-[10px] font-mono text-amber-300 hover:text-white flex items-center gap-1"
                        title="Toggle 3D WebGL / 2D Vector"
                      >
                        <Box className="w-3 h-3" />
                        <span>{is3DMode2 ? '3D Active' : '2D View'}</span>
                      </button>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400 group-hover:text-amber-300 transition-colors">
                        <RotateCw className="w-3 h-3" /> Flip 3D
                      </span>
                    </div>
                  </div>

                  {/* Artwork Container: Interactive Three.js 3D Brass Lantern */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="w-full h-48 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900/60 to-slate-950 border border-amber-500/25 flex items-center justify-center relative overflow-hidden mb-4"
                  >
                    {is3DMode2 ? (
                      <ThreeLantern
                        isLit={isLanternLit}
                        color={selectedLanternColor}
                        intensity={glowIntensity}
                      />
                    ) : (
                      <svg className="w-32 h-32 relative z-10" viewBox="0 0 100 100" fill="none">
                        <path d="M35 30 L50 16 L65 30 Z" fill="#D97706" />
                        <rect x="36" y="30" width="28" height="40" rx="4" fill="#FEF3C7" fillOpacity={isLanternLit ? "0.9" : "0.2"} stroke="#B45309" strokeWidth="2" />
                        {isLanternLit && (
                          <ellipse cx="50" cy="50" rx="5" ry="9" fill={selectedLanternColor} className="animate-pulse" />
                        )}
                        <rect x="32" y="70" width="36" height="8" rx="3" fill="#B45309" />
                      </svg>
                    )}
                  </div>

                  <HeadingReveal
                    as="h3"
                    delay={300}
                    className="text-2xl font-bold font-serif mb-1"
                    style={{ color: 'var(--color-text-heading)' }}
                  >
                    Nightlight Collection
                  </HeadingReveal>
                  <p className="text-xs sm:text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>
                    Magical lamps for cozy nights. Soft, flicker-free lanterns engineered to keep away shadows.
                  </p>
                </div>

                {/* Bottom Interactive Trigger */}
                <div className="pt-3 border-t border-slate-700/30 flex items-center justify-between">
                  <button
                    onClick={toggleLanternPower}
                    className={`liquid-glass-button px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                      isLanternLit
                        ? 'text-slate-900 bg-amber-400 hover:bg-amber-300 shadow-amber-400/40'
                        : 'text-slate-300 bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>{isLanternLit ? 'Lantern Lit (ON)' : 'Lantern Off'}</span>
                  </button>
                  <span className="text-[11px] text-amber-300 font-semibold font-rounded">Tap to Flip ↻</span>
                </div>
              </div>

              {/* BACK OF CARD 2 */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 liquid-glass rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl border border-amber-400/50">
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-bold text-amber-400 font-serif text-sm">Lamp Engineering Studio</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFlipped2(false);
                      }}
                      className="liquid-glass-pill px-2.5 py-1 text-[11px] text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" /> Back
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    Every lantern is filled with captured star embers. Adjust the glow spectrum below to find your bedroom’s perfect rest temperature.
                  </p>

                  {/* Color Preset Palette */}
                  <div className="space-y-2 mb-3">
                    <span className="text-[11px] text-slate-400">Glow Hue:</span>
                    <div className="flex items-center gap-2">
                      {[
                        { color: '#f59e0b', name: 'Amber' },
                        { color: '#93c5fd', name: 'Moonlight' },
                        { color: '#f472b6', name: 'Rose' },
                        { color: '#34d399', name: 'Mint' },
                      ].map((h) => (
                        <button
                          key={h.color}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLanternColor(h.color);
                            soundEngine.playLanternClick();
                          }}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                            selectedLanternColor === h.color
                              ? 'border-white bg-white/20 text-white shadow-sm'
                              : 'border-transparent bg-slate-800 text-slate-400'
                          }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: h.color }} />
                          <span>{h.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Brightness preview slider */}
                  <div className="liquid-glass rounded-2xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span>Brightness Radius</span>
                      <span className="font-mono text-amber-300">{glowIntensity}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={glowIntensity}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => setGlowIntensity(Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 text-center border-t border-slate-700/30 pt-3">
                  Click card again to flip to front
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CARD 03 — DREAM DELIVERY ROUTES */}
        {/* ======================================================== */}
        <div
          ref={card3Observer.ref}
          className={`h-full transition-all duration-700 reveal-fade-up reveal-delay-450 ${
            isSectionRevealed || card3Observer.isRevealed ? 'is-revealed' : ''
          }`}
        >
          <div
            ref={card3Tilt.ref}
            style={card3Tilt.tiltStyle}
            onPointerMove={card3Tilt.onPointerMove}
            onPointerLeave={card3Tilt.onPointerLeave}
            className="perspective-1000 h-[510px] cursor-pointer group relative"
            onClick={() => setIsFlipped3(!isFlipped3)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsFlipped3(!isFlipped3);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Dream Delivery Routes Project Card. Press Enter to flip."
          >
            <div className="absolute inset-0 rounded-3xl z-20 pointer-events-none" style={card3Tilt.glareStyle} />

            <div
              className={`relative w-full h-full transition-transform duration-700 preserve-3d ${
                isFlipped3 ? 'rotate-y-180' : ''
              }`}
            >
              {/* FRONT OF CARD 3 */}
              <div className="absolute inset-0 backface-hidden liquid-glass rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl border border-sky-300/35 overflow-hidden">
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-semibold text-sky-400 font-rounded">Midnight Logistics</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIs3DMode3(!is3DMode3);
                        }}
                        className="liquid-glass-pill px-2 py-0.5 text-[10px] font-mono text-sky-300 hover:text-white flex items-center gap-1"
                        title="Toggle 3D WebGL / 2D Vector"
                      >
                        <Box className="w-3 h-3" />
                        <span>{is3DMode3 ? '3D Active' : '2D View'}</span>
                      </button>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400 group-hover:text-sky-300 transition-colors">
                        <RotateCw className="w-3 h-3" /> Flip 3D
                      </span>
                    </div>
                  </div>

                  {/* Artwork Container: Interactive Three.js 3D Rooftops Diorama */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="w-full h-48 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900/70 to-slate-950 border border-sky-500/25 flex items-center justify-center relative overflow-hidden mb-4"
                  >
                    {is3DMode3 ? (
                      <ThreeRooftops
                        isDelivering={isDelivering}
                        flightProgress={flightProgress}
                      />
                    ) : (
                      <div className="w-full h-full relative flex items-center justify-center p-2 bg-slate-950/90 rounded-2xl overflow-hidden">
                        <DreamPath
                          isRevealed={true}
                          progress={flightProgress}
                          showWaypoints={true}
                          showTravelingComet={true}
                          height="100%"
                          className="w-full h-full"
                        />
                      </div>
                    )}
                  </div>

                  <HeadingReveal
                    as="h3"
                    delay={450}
                    className="text-2xl font-bold font-serif mb-1"
                    style={{ color: 'var(--color-text-heading)' }}
                  >
                    Dream Delivery Routes
                  </HeadingReveal>
                  <p className="text-xs sm:text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>
                    Flying dreams across the rooftops. Pip charts calm trajectories over quiet sleeping houses.
                  </p>
                </div>

                {/* Bottom Interactive Trigger */}
                <div className="pt-3 border-t border-slate-700/30 flex items-center justify-between">
                  <button
                    onClick={startDelivery}
                    className="liquid-glass-button px-4 py-2 rounded-full text-xs font-bold text-white bg-sky-600/75 hover:bg-sky-600 flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isDelivering ? 'Delivering...' : 'Start Delivery'}</span>
                  </button>
                  <span className="text-[11px] text-sky-300 font-semibold font-rounded">Tap to Flip ↻</span>
                </div>
              </div>

              {/* BACK OF CARD 3 */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 liquid-glass rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl border border-sky-400/50">
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-bold text-sky-400 font-serif text-sm">Rooftop Flight Radar</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFlipped3(false);
                      }}
                      className="liquid-glass-pill px-2.5 py-1 text-[11px] text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" /> Back
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    Pip's flight plan navigates around chimney soot and tree branches, dropping stardust directly through open bedroom windows.
                  </p>

                  {/* Route Progress Visualizer */}
                  <div className="liquid-glass rounded-2xl p-4 space-y-3 mb-3">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span>Rooftop Trajectory</span>
                      <span className="font-mono text-sky-400">{flightProgress}% Delivered</span>
                    </div>

                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-pink-500 to-sky-400 h-full transition-all duration-150"
                        style={{ width: `${flightProgress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={startDelivery}
                        disabled={isDelivering}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Send className="w-3 h-3" />
                        <span>Launch Flight</span>
                      </button>

                      <button
                        onClick={resetDelivery}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 text-center border-t border-slate-700/30 pt-3">
                  Click card again to flip to front
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

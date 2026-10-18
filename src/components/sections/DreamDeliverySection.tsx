import React, { useState, useEffect } from 'react';
import { PipState } from '../../types/character';
import { PipCharacter } from '../character/PipCharacter';
import { soundEngine } from '../../utils/soundEffects';
import { Rocket, Send, CheckCircle2, Navigation, Compass, Sparkles } from 'lucide-react';
import { HeadingReveal } from '../effects/HeadingReveal';
import { DreamPath } from '../effects/DreamPath';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

export interface DreamDeliverySectionProps {
  onStartDelivery?: () => void;
  pipState?: PipState;
  theme: 'day' | 'night';
  enableTilt?: boolean;
  isRevealed?: boolean;
}

export interface Recipient {
  id: string;
  name: string;
  location: string;
  dreamType: string;
  distance: string;
}

export const RECIPIENTS: Recipient[] = [
  {
    id: 'bear',
    name: 'Sleepy Forest Bear',
    location: 'Evergreen Hollow',
    dreamType: 'Wild Blackberry & Warm Honey Cave',
    distance: '3.4 Light Leagues',
  },
  {
    id: 'rabbit',
    name: 'Little Cloud Rabbit',
    location: 'Cumulus Meadows',
    dreamType: 'Floating Stardust Clover Patch',
    distance: '1.8 Light Leagues',
  },
  {
    id: 'owl',
    name: 'Moonlit Stargazer Owl',
    location: 'High Silver Birch',
    dreamType: 'Silent Silver Wind Gliding',
    distance: '5.2 Light Leagues',
  },
];

export const DreamDeliverySection: React.FC<DreamDeliverySectionProps> = ({
  onStartDelivery,
  theme,
  enableTilt = true,
  isRevealed: propIsRevealed,
}) => {
  const [selectedRecipientId, setSelectedRecipientId] = useState('rabbit');
  const [isDelivering, setIsDelivering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [deliveryComplete, setDeliveryComplete] = useState(false);

  // Hook for viewport entrance trigger
  const { ref: sectionRef, isRevealed: localRevealed } = useIntersectionObserver<HTMLElement>({
    threshold: 0.12,
    triggerOnce: true,
  });

  const isRevealed = propIsRevealed !== undefined ? propIsRevealed : localRevealed;

  const activeRecipient = RECIPIENTS.find((r) => r.id === selectedRecipientId) || RECIPIENTS[0];

  const handleLaunchDelivery = () => {
    soundEngine.playDreamWhoosh();
    setIsDelivering(true);
    setProgress(0);
    setDeliveryComplete(false);
    onStartDelivery?.();
  };

  useEffect(() => {
    if (!isDelivering) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDelivering(false);
          setDeliveryComplete(true);
          soundEngine.playStarSparkle();
          return 100;
        }
        return prev + 4;
      });
    }, 90);

    return () => clearInterval(interval);
  }, [isDelivering]);

  return (
    <section
      id="dream-delivery-routes"
      ref={sectionRef}
      className={`py-20 lg:py-28 relative border-t border-slate-800/40 reveal-fade-up ${
        isRevealed ? 'is-revealed' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-12 space-y-12">
        {/* SECTION HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-pill text-xs font-semibold">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span style={{ color: 'var(--color-text-main)' }}>Midnight Route Logistics</span>
          </div>

          <HeadingReveal
            as="h2"
            delay={80}
            className="text-3xl sm:text-5xl font-bold font-serif tracking-tight"
            style={{ color: 'var(--color-text-heading)' }}
          >
            Dream Delivery Routes
          </HeadingReveal>

          <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            When darkness blankets the nursery, Pip straps on cloud wings to navigate constellation trajectories,
            delivering sweet dream parcels right through bedroom windows.
          </p>
        </div>

        {/* CONTINUOUS GLOWING DOTTED LINE DREAM PATH (SVG COMPONENT) */}
        <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-sky-400/25 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span>Continuous Constellation Flight Path</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>Status:</span>
              <span className={isDelivering ? 'text-sky-400 animate-pulse font-bold' : 'text-slate-300'}>
                {isDelivering ? `In Transit (${progress}%)` : 'Live Flight Radar'}
              </span>
            </div>
          </div>

          {/* DreamPath SVG Component drawing across the screen */}
          <DreamPath
            isRevealed={isRevealed}
            progress={isDelivering ? progress : undefined}
            selectedWaypointId={selectedRecipientId}
            onSelectWaypoint={(id) => {
              if (id !== 'launchpad') {
                setSelectedRecipientId(id);
                setDeliveryComplete(false);
                soundEngine.playGentlePop();
              }
            }}
            showWaypoints={true}
            showTravelingComet={true}
            height={200}
            className="w-full"
          />

          <div className="text-center mt-2">
            <span className="text-[11px] text-slate-400 font-mono">
              ★ Click any waypoint star on the dotted path to select that bedtime recipient
            </span>
          </div>
        </div>

        {/* INTERACTIVE CONTROLS & PIP CHARACTER FLIGHT STAGE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* LEFT: CHARACTER FLYING IN DREAM FLIGHT POSE */}
          <div className="lg:col-span-5 flex flex-col items-center justify-between p-8 liquid-glass rounded-3xl border border-sky-500/20 relative overflow-hidden shadow-xl">
            <div className="w-full flex items-center justify-between text-xs font-semibold text-sky-400 mb-4">
              <div className="flex items-center gap-1.5">
                <Navigation className="w-4 h-4" />
                <span>{isDelivering ? 'In Flight' : 'Standby at Launchpad'}</span>
              </div>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-sky-950/60 text-sky-300 border border-sky-500/30">
                {activeRecipient.distance}
              </span>
            </div>

            <div className={`transition-transform duration-500 my-4 ${isDelivering ? 'translate-x-3 -translate-y-3 scale-110' : ''}`}>
              <PipCharacter
                state={isDelivering ? 'flying' : 'idle'}
                size="lg"
                enableTilt={enableTilt}
                theme={theme}
                showSpeechBubble={true}
                speechText={
                  isDelivering
                    ? `Flying to ${activeRecipient.name}! Delivering stardust!`
                    : `Route plotted for ${activeRecipient.name}!`
                }
              />
            </div>

            <div className="mt-4 text-center">
              <div className="text-sm font-bold text-white font-serif">
                Pip in Dream Flight
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Tilted flight posture with trailing stardust coordinates.
              </p>
            </div>
          </div>

          {/* RIGHT: ROUTE RECIPIENTS & LAUNCH TRIGGER */}
          <div className="lg:col-span-7 flex flex-col justify-between p-8 liquid-glass rounded-3xl border border-sky-500/20 space-y-6 shadow-xl">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">
                <Rocket className="w-3.5 h-3.5" />
                <span>Select Bedtime Recipient</span>
              </div>

              {/* Recipient Selection List */}
              <div className="space-y-3 pt-2">
                {RECIPIENTS.map((rec) => {
                  const isSelected = selectedRecipientId === rec.id;
                  return (
                    <button
                      key={rec.id}
                      onClick={() => {
                        setSelectedRecipientId(rec.id);
                        setDeliveryComplete(false);
                        soundEngine.playGentlePop();
                      }}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-sky-950/50 border-sky-400 text-white shadow-lg ring-1 ring-sky-400/50'
                          : 'liquid-glass border-slate-700/30 text-slate-300 hover:border-sky-400/40 hover:bg-white/5'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-bold font-serif text-white flex items-center gap-2">
                          <span>{rec.name}</span>
                          {isSelected && <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {rec.location} · <span className="text-pink-300 font-medium">{rec.dreamType}</span>
                        </div>
                      </div>
                      <div className="text-xs text-sky-300 font-mono shrink-0 bg-sky-900/40 px-2.5 py-1 rounded-full border border-sky-500/20">
                        {rec.distance}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Flight Route Simulator Bar & Action Button */}
            <div className="p-5 liquid-glass rounded-2xl border border-sky-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>
                  Destination: <strong className="text-white">{activeRecipient.name}</strong>
                </span>
                <span className="font-mono text-sky-400 font-semibold">{progress}% Flown</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-900/80 h-3 rounded-full overflow-hidden p-0.5 border border-sky-500/20">
                <div
                  className="bg-gradient-to-r from-pink-500 via-sky-400 to-amber-300 h-full rounded-full transition-all duration-150 shadow-[0_0_10px_#38bdf8]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Status & Delivery Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <button
                  disabled={isDelivering}
                  onClick={handleLaunchDelivery}
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-medium text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer hover:shadow-sky-500/30"
                >
                  <Send className="w-4 h-4" />
                  <span>{isDelivering ? 'Delivering Stardust...' : 'Launch Dream Flight'}</span>
                </button>

                {deliveryComplete && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium animate-fade-in bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-500/30">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Delivered to {activeRecipient.name}!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

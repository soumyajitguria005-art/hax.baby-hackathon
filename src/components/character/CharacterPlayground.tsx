import React from 'react';
import { PipState } from '../../types/character';
import { PIP_STATE_CONFIGS } from './characterStateMap';
import { PipCharacter } from './PipCharacter';
import { Sparkles, Sliders, Volume2, VolumeX, Eye } from 'lucide-react';
import { ScrollReveal } from '../effects/ScrollReveal';
import { HeadingReveal } from '../effects/HeadingReveal';
import { TextAnimation } from '../text';

interface CharacterPlaygroundProps {
  currentState: PipState;
  onSelectState: (state: PipState) => void;
  enableTilt: boolean;
  onToggleTilt: () => void;
  soundMuted: boolean;
  onToggleSound: () => void;
  theme: 'day' | 'night';
}

const ALL_STATES: PipState[] = [
  'idle',
  'happy',
  'curious',
  'excited',
  'sleepy',
  'surprised',
  'shy',
  'reading',
  'working',
  'flying',
  'holding-lantern',
  'sleeping',
];

export const CharacterPlayground: React.FC<CharacterPlaygroundProps> = ({
  currentState,
  onSelectState,
  enableTilt,
  onToggleTilt,
  soundMuted,
  onToggleSound,
  theme,
}) => {
  const activeConfig = PIP_STATE_CONFIGS[currentState];

  return (
    <div className="liquid-glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-400/25">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-700/20">
        <ScrollReveal distance={24} duration={700}>
          <div>
            <div className="flex items-center gap-2 text-pink-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sliders className="w-4 h-4" />
              <span>Interactive State Inspector</span>
            </div>
            <HeadingReveal
              as="h3"
              delay={80}
              className="text-2xl sm:text-3xl font-bold font-serif"
              style={{ color: 'var(--color-text-heading)' }}
            >
              <TextAnimation divideBy="word">
                Pip Character Engine Studio
              </TextAnimation>
            </HeadingReveal>
            <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Preview all 12 typed emotional and posture states in real time.
            </p>
          </div>
        </ScrollReveal>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleTilt}
            className={`liquid-glass-pill px-3 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              enableTilt
                ? 'border-pink-400 text-pink-300'
                : 'text-slate-400'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            {enableTilt ? 'Head Tilt: Active' : 'Head Tilt: Off'}
          </button>
          <button
            onClick={onToggleSound}
            className={`liquid-glass-pill px-3 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              !soundMuted
                ? 'border-amber-400 text-amber-300'
                : 'text-slate-400'
            }`}
          >
            {!soundMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            {!soundMuted ? 'Audio: On' : 'Audio: Muted'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-center">
        {/* CHARACTER DISPLAY VIEWPORT */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 liquid-glass rounded-2xl min-h-[320px] relative overflow-hidden border border-pink-400/20">
          <div className="absolute top-3 left-3 text-xs font-mono text-pink-400">
            state: "{currentState}"
          </div>
          <div className="absolute top-3 right-3 text-xs font-mono text-amber-400">
            pose: "{activeConfig.posture}"
          </div>

          <PipCharacter
            state={currentState}
            size="lg"
            enableTilt={enableTilt}
            theme={theme}
            showSpeechBubble={true}
            interactive={true}
            onStateChange={onSelectState}
          />

          <div className="mt-4 text-center">
            <span className="text-sm font-bold font-serif" style={{ color: 'var(--color-text-heading)' }}>
              {activeConfig.label}
            </span>
            <p className="text-xs mt-1 max-w-xs" style={{ color: 'var(--color-text-muted)' }}>
              {activeConfig.description}
            </p>
          </div>
        </div>

        {/* STATE SELECTION MATRIX */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
              Select Character State
            </span>
            <span className="text-xs text-pink-400 flex items-center gap-1 font-semibold font-rounded">
              <Sparkles className="w-3 h-3" /> Click any button to test state
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {ALL_STATES.map((stateKey) => {
              const item = PIP_STATE_CONFIGS[stateKey];
              const isSelected = currentState === stateKey;
              return (
                <button
                  key={stateKey}
                  onClick={() => onSelectState(stateKey)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'liquid-glass border-pink-400 ring-2 ring-pink-400/40 text-white shadow-md'
                      : 'liquid-glass-pill text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold capitalize font-serif" style={{ color: isSelected ? 'var(--color-text-heading)' : undefined }}>
                      {stateKey}
                    </span>
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.accentColor }}
                    />
                  </div>
                  <div className="text-[11px] truncate" style={{ color: 'var(--color-text-muted)' }}>
                    {item.label}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 p-3.5 liquid-glass rounded-xl text-xs border border-pink-400/20" style={{ color: 'var(--color-text-muted)' }}>
            <strong className="text-pink-400">Developer Note:</strong> The PipCharacter component is fully reusable across any section of the applet. It manages its own pointer tilt, preloaded assets, touch fallbacks, and animation frame loops cleanly.
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { PipState } from '../../types/character';
import { PipCharacter } from '../character/PipCharacter';
import { soundEngine } from '../../utils/soundEffects';
import { Flame, Sparkles, SunDim } from 'lucide-react';
import { HeadingReveal } from '../effects/HeadingReveal';

interface NightlightSectionProps {
  onSwitchLantern: (color: string) => void;
  pipState: PipState;
  theme: 'day' | 'night';
  enableTilt: boolean;
}

interface NightlightOption {
  id: string;
  name: string;
  colorName: string;
  glowColor: string;
  bgColor: string;
  description: string;
  kelvin: string;
}

const LANTERNS: NightlightOption[] = [
  {
    id: 'starlight-brass',
    name: 'Starlight Brass Lantern',
    colorName: 'Warm Amber',
    glowColor: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.15)',
    description: 'Pip’s signature bedtime lantern, hand-forged from recycled constellation brass.',
    kelvin: '2400K Warm Glow',
  },
  {
    id: 'lunar-pearl',
    name: 'Lunar Pearl Beacon',
    colorName: 'Moonlight Mist',
    glowColor: '#93C5FD',
    bgColor: 'rgba(147, 197, 253, 0.15)',
    description: 'Diffuses soft silver moonlight to banish shadow monsters under the bed.',
    kelvin: '4000K Soothing Soft',
  },
  {
    id: 'aurora-ember',
    name: 'Aurora Rose Chamber',
    colorName: 'Blush Sunset',
    glowColor: '#F472B6',
    bgColor: 'rgba(244, 114, 182, 0.15)',
    description: 'A comforting twilight glow inspired by evening bedtime hugs and storybooks.',
    kelvin: '2700K Rose Velvet',
  },
  {
    id: 'dream-emerald',
    name: 'Willowfire Lamp',
    colorName: 'Dream Mint',
    glowColor: '#34D399',
    bgColor: 'rgba(52, 211, 153, 0.15)',
    description: 'Calming woodland luminesce gathered from friendly sleep-fireflies in the glade.',
    kelvin: '3200K Tranquil Green',
  },
];

export const NightlightSection: React.FC<NightlightSectionProps> = ({
  onSwitchLantern,
  theme,
  enableTilt,
}) => {
  const [selectedLanternId, setSelectedLanternId] = useState('starlight-brass');
  const [isSwitchedOn, setIsSwitchedOn] = useState(true);

  const activeLantern = LANTERNS.find((l) => l.id === selectedLanternId) || LANTERNS[0];

  const handleSelectLantern = (lantern: NightlightOption) => {
    soundEngine.playLanternClick();
    setSelectedLanternId(lantern.id);
    onSwitchLantern(lantern.glowColor);
  };

  const toggleLanternPower = () => {
    soundEngine.playLanternClick();
    setIsSwitchedOn(!isSwitchedOn);
    onSwitchLantern(isSwitchedOn ? '#000000' : activeLantern.glowColor);
  };

  return (
    <section id="nightlights" className="py-20 lg:py-24 border-b border-slate-800/80 bg-slate-950/40 relative">
      {/* Dynamic ambient room glow radiating from active lantern */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none transition-all duration-700 blur-3xl opacity-30"
        style={{
          backgroundColor: isSwitchedOn ? activeLantern.glowColor : 'transparent',
        }}
      />

      <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* LEFT: CHARACTER HOLDING LANTERN */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 bg-slate-900/60 rounded-2xl border border-slate-800 relative">
            <div className="absolute top-4 left-4 flex items-center gap-2 text-xs font-semibold text-amber-400">
              <Flame className="w-4 h-4" />
              <span>{isSwitchedOn ? 'Lantern Lit' : 'Lantern Extinguished'}</span>
            </div>

            <PipCharacter
              state={isSwitchedOn ? 'holding-lantern' : 'idle'}
              size="lg"
              enableTilt={enableTilt}
              theme={theme}
              ambientGlow={isSwitchedOn}
              showSpeechBubble={true}
              speechText={
                isSwitchedOn
                  ? `Lit the ${activeLantern.name}! Cozy night ahead!`
                  : 'Click a lantern to illuminate the nursery!'
              }
            />

            <div className="mt-4 text-center">
              <span className="text-sm font-semibold text-white">
                Pip in Nightlight Watch
              </span>
              <p className="text-xs text-slate-400 mt-1">
                Holding the warm brass lantern to guide sweet dreams.
              </p>
            </div>
          </div>

          {/* RIGHT: LANTERN SHOWCASE & CONTROLS */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <SunDim className="w-3.5 h-3.5" />
              <span>Nursery Illumination</span>
            </div>

            <HeadingReveal
              as="h2"
              delay={80}
              className="text-3xl sm:text-4xl font-bold text-white font-display"
            >
              The Nightlight Collection
            </HeadingReveal>

            <p className="text-slate-300 text-base leading-relaxed">
              Every nightlight is tested by Pip for warmth, whisper-quiet thermal balance, and soothing chromatic wavelengths. Switch on any lantern to illuminate the nursery!
            </p>

            {/* Lantern Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {LANTERNS.map((lantern) => {
                const isSelected = selectedLanternId === lantern.id;
                return (
                  <button
                    key={lantern.id}
                    onClick={() => handleSelectLantern(lantern)}
                    className={`p-4 rounded-xl border text-left transition-all duration-300 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-900 border-amber-500/80 shadow-md ring-1 ring-amber-500/50'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white font-display">
                          {lantern.name}
                        </span>
                        <span
                          className="w-3 h-3 rounded-full shadow-sm"
                          style={{
                            backgroundColor: lantern.glowColor,
                            boxShadow: `0 0 10px ${lantern.glowColor}`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {lantern.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{lantern.kelvin}</span>
                      <span className="font-semibold" style={{ color: lantern.glowColor }}>
                        {lantern.colorName}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Power Toggle Button */}
            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={toggleLanternPower}
                className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                  isSwitchedOn
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSwitchedOn ? 'Turn Off Lantern' : 'Light Lantern'}</span>
              </button>

              <span className="text-xs text-slate-400">
                {isSwitchedOn
                  ? `Active: ${activeLantern.name}`
                  : 'Pip waits in the dark'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

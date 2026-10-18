import React from 'react';
import { PipCharacter } from '../character/PipCharacter';
import { Cloud, Sparkles, Shield, Bookmark } from 'lucide-react';
import { TextAnimation, MorphText } from '../text';
import { ScrollReveal } from '../effects/ScrollReveal';
import { HeadingReveal } from '../effects/HeadingReveal';

interface AboutSectionProps {
  onHoverProject: () => void;
  onLeaveProject: () => void;
  theme: 'day' | 'night';
  enableTilt: boolean;
}

const DREAM_PROJECTS = [
  {
    id: 'cloud-fluff',
    title: 'Cloud Fluff Formula',
    category: 'Rest Dynamics',
    description:
      'A proprietary micro-density cloud cushion tuned to 420 fluff units for zero pressure on sleepy skulls.',
    specs: 'Formula v2.4 · 100% hypoallergenic vapor',
    icon: Cloud,
  },
  {
    id: 'starlight-dimmer',
    title: 'Starlight Dimmer Matrix',
    category: 'Optical Comfort',
    description:
      'Gently softens intrusive celestial glare down to a restorative 2700K amber bedtime radiance.',
    specs: 'Amber filter · Zero circadian disturbance',
    icon: Sparkles,
  },
  {
    id: 'nightmare-filter',
    title: 'Nightmare Filter Prism',
    category: 'Subconscious Care',
    description:
      'A micro-faceted quartz filter that converts anxious bedtime thoughts into soothing lavender riverdreams.',
    specs: 'Harmonic resonance · Lavender aroma layer',
    icon: Shield,
  },
];

export const AboutSection: React.FC<AboutSectionProps> = ({
  onHoverProject,
  onLeaveProject,
  theme,
  enableTilt,
}) => {
  return (
    <section id="about" className="py-20 lg:py-24 relative">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <ScrollReveal distance={28} duration={700}>
          <div className="max-w-2xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass-pill text-xs font-semibold mb-3">
              <Bookmark className="w-3.5 h-3.5 text-pink-400" />
              <span style={{ color: 'var(--color-text-main)' }}>Dream Engineering Principles</span>
            </div>
            <HeadingReveal
              as="h2"
              delay={80}
              className="text-3xl sm:text-5xl font-bold font-serif tracking-tight"
              style={{ color: 'var(--color-text-heading)' }}
            >
              <TextAnimation divideBy="word">
                Behind the Scenes at Midnight Nursery
              </TextAnimation>
            </HeadingReveal>
            <p className="mt-3 text-sm sm:text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              As a Junior Dream Engineer, Pip is responsible for curating every ingredient of a peaceful night's rest. Hover over any blueprint below to see Pip inspect it with curious amber eyes!
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: CHARACTER SITTING / STUDYING IN ABOUT POSE */}
          <ScrollReveal distance={28} duration={700} delay={100} className="lg:col-span-4 h-full">
            <div className="flex flex-col items-center justify-center p-8 liquid-glass rounded-3xl shadow-xl h-full">
              <PipCharacter
                state="curious"
                size="lg"
                enableTilt={enableTilt}
                theme={theme}
                showSpeechBubble={true}
                speechText="Hover a project? Let me inspect the blueprints!"
              />
              <div className="mt-4 text-center w-full flex flex-col items-center">
                <span className="text-sm font-bold font-serif" style={{ color: 'var(--color-text-heading)' }}>
                  Pip in Study Mode
                </span>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                  Tilted head & inquisitive amber gaze inspecting active projects.
                </p>

                <div className="mt-5 pt-4 border-t border-pink-400/20 w-full flex flex-col items-center">
                  <span className="text-[10px] tracking-widest text-slate-400 font-mono uppercase mb-1">
                    Active Research Focus
                  </span>
                  <MorphText
                    words={["COZY SLEEP", "ALPHA CHORDS", "WARM AMBER", "STARRY SKIES"]}
                    interval={2800}
                    fontSize="1.1rem"
                    textClassName="text-pink-400 font-bold"
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* RIGHT: THE 3 INTERACTIVE BLUEPRINTS */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {DREAM_PROJECTS.map((proj, idx) => {
              const Icon = proj.icon;
              return (
                <ScrollReveal
                  key={proj.id}
                  distance={28}
                  duration={700}
                  delay={150 + idx * 90}
                  className="h-full"
                >
                  <div
                    onMouseEnter={onHoverProject}
                    onMouseLeave={onLeaveProject}
                    className="group p-6 liquid-glass rounded-3xl shadow-xl transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between cursor-pointer border border-pink-400/20 h-full"
                  >
                    <div>
                      {/* Unboxed metadata separator */}
                      <div className="flex items-center gap-2 text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>
                        <span>{proj.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-pink-400 font-semibold font-rounded">Verified Safe</span>
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-pink-500/15 text-pink-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>

                      <HeadingReveal
                        as="h3"
                        delay={150 + idx * 80}
                        className="text-lg font-bold font-serif transition-colors"
                        style={{ color: 'var(--color-text-heading)' }}
                      >
                        {proj.title}
                      </HeadingReveal>

                      <p className="text-xs sm:text-sm mt-2 leading-relaxed" style={{ color: 'var(--color-text-main)' }}>
                        {proj.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-700/20 text-[11px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
                      {proj.specs}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};


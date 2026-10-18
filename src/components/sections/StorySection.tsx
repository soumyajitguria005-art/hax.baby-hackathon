import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, BookOpen, Star, Compass, ChevronLeft, ChevronRight, Moon } from 'lucide-react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { HeadingReveal } from '../effects/HeadingReveal';
import { TextAnimation } from '../text';
import { soundEngine } from '../../utils/soundEffects';

export interface SceneData {
  number: string;
  title: string;
  mood: string;
  tagline: string;
  story: string;
  icon: React.ElementType;
  color: string;
}

export const SCENES: SceneData[] = [
  {
    number: '01',
    title: 'The Little Star That Fell',
    mood: 'Quiet, magical, and full of wonder.',
    tagline: 'Quiet, magical, and full of wonder',
    story:
      'On a quiet night, when the moon painted the clouds in silver, a tiny star slipped from the sky. It landed softly on a fluffy cloud, right beside a little sleepy dreamer named Pip. The star was small, but its light held a thousand unwritten dreams.',
    icon: Star,
    color: '#f1c66d',
  },
  {
    number: '02',
    title: 'A World of Unfinished Dreams',
    mood: 'Curious, playful, and imaginative.',
    tagline: 'Curious, playful, and imaginative',
    story:
      "Pip discovered that some dreams were still waiting to be born. A lonely moon wished for a lullaby. A little cloud wanted to become a castle. Somewhere, a child was waiting for a bedtime adventure. Pip gathered the star's glowing magic and began turning these wishes into dreams.",
    icon: Sparkles,
    color: '#f472b6',
  },
  {
    number: '03',
    title: 'The Midnight Nursery',
    mood: 'Warm, hopeful, and magical.',
    tagline: 'Warm, hopeful, and magical',
    story:
      'With every dream Pip created, another light appeared in the midnight sky. Soon, floating islands shimmered above the clouds, golden lanterns glowed in sleepy gardens, and gentle melodies filled the night. Pip became the Junior Dream Engineer of the Midnight Nursery, helping imagination find its way into every sleepy heart.',
    icon: Moon,
    color: '#38bdf8',
  },
];

// Staggered reveal delay classes for sequential entrance
const SCENE_DELAYS = [
  'reveal-delay-150',
  'reveal-delay-300',
  'reveal-delay-450',
];

interface StorySceneItemProps {
  scene: SceneData;
  index: number;
  isParentRevealed?: boolean;
  isActive?: boolean;
  onSelect?: () => void;
}

const StorySceneItem: React.FC<StorySceneItemProps> = ({
  scene,
  index,
  isParentRevealed,
  isActive = false,
  onSelect,
}) => {
  const isEven = index % 2 === 0;
  const Icon = scene.icon;

  const { ref, isRevealed: isLocalRevealed } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.15,
    triggerOnce: true,
  });

  const hasPlayedChimeRef = useRef(false);

  useEffect(() => {
    if (isLocalRevealed && !hasPlayedChimeRef.current) {
      hasPlayedChimeRef.current = true;
      const chimeTimer = window.setTimeout(() => {
        soundEngine.playStoryChime(index);
      }, 100);
      return () => window.clearTimeout(chimeTimer);
    }
  }, [isLocalRevealed, index]);

  const isRevealed = isParentRevealed || isLocalRevealed;
  const delayClass = SCENE_DELAYS[index % SCENE_DELAYS.length];

  return (
    <div
      id={`scene-${index + 1}`}
      ref={ref}
      tabIndex={0}
      role="article"
      aria-label={`Scene ${scene.number}: ${scene.title}`}
      className={`w-full transition-all duration-700 reveal-fade-up ${delayClass} ${
        isRevealed ? 'is-revealed' : ''
      } focus:outline-none`}
    >
      <div
        className={`relative flex flex-col md:flex-row items-center gap-8 ${
          isEven ? 'md:flex-row' : 'md:flex-row-reverse'
        }`}
      >
        {/* Timeline Badge in Center */}
        <div
          onClick={onSelect}
          className={`hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full liquid-glass border-2 items-center justify-center z-10 shadow-lg text-xs font-bold font-mono text-white cursor-pointer transition-transform hover:scale-110 ${
            isActive ? 'border-pink-300 scale-110 shadow-pink-500/40 ring-2 ring-pink-400/40' : 'border-pink-400/60'
          }`}
          style={{ backgroundColor: `${scene.color}20` }}
        >
          {scene.number}
        </div>

        {/* Story Content Card */}
        <div className="w-full md:w-[45%]">
          <div
            onClick={onSelect}
            className={`liquid-glass rounded-3xl p-6 sm:p-8 shadow-xl transition-all duration-300 hover:scale-[1.01] border group cursor-pointer ${
              isActive
                ? 'border-pink-400 shadow-pink-500/20 ring-1 ring-pink-400/40'
                : 'border-pink-400/20 hover:border-pink-400/40'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold font-mono text-pink-400 uppercase tracking-wider">
                SCENE {scene.number}
              </span>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: `${scene.color}25`, color: scene.color }}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Primary Heading with reveal logic */}
            <HeadingReveal
              as="h3"
              delay={index * 150 + 60}
              className="text-xl sm:text-2xl font-bold font-serif mb-1"
              style={{ color: 'var(--color-text-heading)' }}
            >
              {scene.title}
            </HeadingReveal>

            {/* Scene Mood Subtitle */}
            <div className="text-xs font-semibold text-pink-300 font-rounded mb-3">
              {scene.tagline}
            </div>

            {/* Exact Full Story Text */}
            <p
              className="text-xs sm:text-sm leading-relaxed"
              style={{ color: 'var(--color-text-main)' }}
            >
              {scene.story}
            </p>
          </div>
        </div>

        {/* Spacer for other column on desktop */}
        <div className="hidden md:block w-full md:w-[45%]" />
      </div>
    </div>
  );
};

export interface StorySectionProps {
  isRevealed?: boolean;
}

export const StorySection: React.FC<StorySectionProps> = ({ isRevealed: propIsRevealed }) => {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  const { ref: sectionRef, isRevealed: isSectionObserverRevealed } = useIntersectionObserver<HTMLElement>({
    threshold: 0.15,
    triggerOnce: true,
  });

  const isRevealed = propIsRevealed !== undefined ? propIsRevealed : isSectionObserverRevealed;

  const scrollToScene = (index: number) => {
    setActiveSceneIndex(index);
    soundEngine.playStoryChime(index);
    const element = document.getElementById(`scene-${index + 1}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handlePrev = () => {
    const nextIdx = (activeSceneIndex - 1 + SCENES.length) % SCENES.length;
    scrollToScene(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = (activeSceneIndex + 1) % SCENES.length;
    scrollToScene(nextIdx);
  };

  return (
    <section
      id="story"
      ref={sectionRef}
      className={`py-20 lg:py-28 relative reveal-fade-up ${isRevealed ? 'is-revealed' : ''}`}
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div
          className={`text-center max-w-2xl mx-auto mb-12 space-y-3 reveal-fade-up reveal-delay-75 ${
            isRevealed ? 'is-revealed' : ''
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-pill text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5 text-pink-400" />
            <span style={{ color: 'var(--color-text-main)' }}>Pip's Origin Story</span>
          </div>

          <HeadingReveal
            as="h2"
            delay={100}
            className="text-3xl sm:text-5xl font-bold font-serif tracking-tight"
            style={{ color: 'var(--color-text-heading)' }}
          >
            <TextAnimation divideBy="word">
              How Pip Came to Dream
            </TextAnimation>
          </HeadingReveal>

          <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            Follow the glowing constellation path through three magical scenes to discover how Pip became the Junior Dream Engineer of the Midnight Nursery.
          </p>

          {/* Accessible Scene Switcher & Stepper Controls */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={handlePrev}
              className="liquid-glass-pill p-2 text-pink-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Previous story scene"
              title="Previous scene"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {SCENES.map((sc, idx) => (
              <button
                key={sc.number}
                onClick={() => scrollToScene(idx)}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeSceneIndex === idx
                    ? 'bg-pink-600 text-white shadow-md shadow-pink-500/30 ring-1 ring-pink-400/50'
                    : 'liquid-glass-pill text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                aria-label={`Jump to Scene ${sc.number}: ${sc.title}`}
              >
                <span>Scene {sc.number}</span>
                <span className="hidden sm:inline text-[11px] opacity-80 ml-1">· {sc.title}</span>
              </button>
            ))}

            <button
              onClick={handleNext}
              className="liquid-glass-pill p-2 text-pink-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Next story scene"
              title="Next scene"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Timeline with Glowing Dotted Path */}
        <div className="relative">
          {/* Central glowing vertical dotted line for desktop */}
          <div className="hidden md:block absolute left-1/2 top-8 bottom-8 -translate-x-1/2 w-0.5 border-l-2 border-dashed border-pink-400/40 pointer-events-none" />

          {/* Scenes mapped with staggered reveal-delay-* classes */}
          <div className="space-y-12 sm:space-y-16">
            {SCENES.map((sc, idx) => {
              const delayClass = SCENE_DELAYS[idx % SCENE_DELAYS.length];
              return (
                <div
                  key={sc.number}
                  className={`w-full reveal-fade-up ${delayClass} ${
                    isRevealed ? 'is-revealed' : ''
                  }`}
                >
                  <StorySceneItem
                    scene={sc}
                    index={idx}
                    isParentRevealed={isRevealed}
                    isActive={activeSceneIndex === idx}
                    onSelect={() => scrollToScene(idx)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

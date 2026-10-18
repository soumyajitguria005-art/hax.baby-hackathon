import React, { useEffect, useRef } from 'react';
import { Sparkles, BookOpen, Moon, Compass } from 'lucide-react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { HeadingReveal } from '../effects/HeadingReveal';
import { TextAnimation } from '../text';
import { soundEngine } from '../../utils/soundEffects';

export interface ChapterData {
  number: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

export const CHAPTERS: ChapterData[] = [
  {
    number: '01',
    title: 'A Sleepy Beginning',
    tagline: 'Under the Cloud Blanket',
    description:
      'Long ago, before Midnight Nursery had its blueprints, tiny Pip discovered an antique brass lantern buried under a downy cloud. Touching the cold wick ignited a permanent warm amber glow that never went out.',
    icon: Moon,
    color: '#f1c66d',
  },
  {
    number: '02',
    title: 'The Dream Engineer',
    tagline: 'Crafting the First Lullaby',
    description:
      'Pip spent nights studying how sound vibrations calm startled bunnies and restless owls. Armed with a pink starry nightcap and a miniature drafting ruler, Pip synthesized the first alpha-wave celesta chord.',
    icon: Sparkles,
    color: '#f472b6',
  },
  {
    number: '03',
    title: 'Dreams for Everyone',
    tagline: 'Rooftops Across the World',
    description:
      'Today, Pip flies over chimney smoke and suburban window ledges every night at midnight. Whenever you wake up feeling rested and warm, you know Pip’s delivery arrived on time.',
    icon: Compass,
    color: '#38bdf8',
  },
];

// Staggered reveal delay classes for sequential entrance
const CHAPTER_DELAYS = [
  'reveal-delay-150',
  'reveal-delay-300',
  'reveal-delay-450',
];

interface StoryChapterItemProps {
  chapter: ChapterData;
  index: number;
  isParentRevealed?: boolean;
}

const StoryChapterItem: React.FC<StoryChapterItemProps> = ({
  chapter,
  index,
  isParentRevealed,
}) => {
  const isEven = index % 2 === 0;
  const Icon = chapter.icon;

  // Local observer in case chapters enter independently on small viewports
  const { ref, isRevealed: isLocalRevealed } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.15,
    triggerOnce: true,
  });

  // Subtle, non-intrusive chime audio feedback when chapter scrolls into view
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
  const delayClass = CHAPTER_DELAYS[index % CHAPTER_DELAYS.length];

  return (
    <div
      ref={ref}
      className={`w-full transition-all duration-700 reveal-fade-up ${delayClass} ${
        isRevealed ? 'is-revealed' : ''
      }`}
    >
      <div
        className={`relative flex flex-col md:flex-row items-center gap-8 ${
          isEven ? 'md:flex-row' : 'md:flex-row-reverse'
        }`}
      >
        {/* Timeline Badge in Center */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full liquid-glass border-2 border-pink-400 items-center justify-center z-10 shadow-lg text-xs font-bold font-mono text-white">
          {chapter.number}
        </div>

        {/* Story Content Card */}
        <div className="w-full md:w-[45%]">
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 shadow-xl transition-all hover:scale-[1.01] border border-pink-400/20 group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold font-mono text-pink-400">
                CHAPTER {chapter.number}
              </span>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: `${chapter.color}25`, color: chapter.color }}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Primary H3 Heading wrapped in HeadingReveal with reveal-fade-up logic */}
            <HeadingReveal
              as="h3"
              delay={index * 150 + 60}
              className="text-xl sm:text-2xl font-bold font-serif mb-1"
              style={{ color: 'var(--color-text-heading)' }}
            >
              {chapter.title}
            </HeadingReveal>

            <div className="text-xs font-semibold text-pink-300 font-rounded mb-3">
              {chapter.tagline}
            </div>

            <p
              className="text-xs sm:text-sm leading-relaxed"
              style={{ color: 'var(--color-text-main)' }}
            >
              {chapter.description}
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
  // Intersection observer hook for the StorySection
  const { ref: sectionRef, isRevealed: isSectionObserverRevealed } = useIntersectionObserver<HTMLElement>({
    threshold: 0.15,
    triggerOnce: true,
  });

  const isRevealed = propIsRevealed !== undefined ? propIsRevealed : isSectionObserverRevealed;

  return (
    <section
      id="story"
      ref={sectionRef}
      className={`py-20 lg:py-28 relative reveal-fade-up ${isRevealed ? 'is-revealed' : ''}`}
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div
          className={`text-center max-w-2xl mx-auto mb-16 space-y-3 reveal-fade-up reveal-delay-75 ${
            isRevealed ? 'is-revealed' : ''
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-pill text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5 text-pink-400" />
            <span style={{ color: 'var(--color-text-main)' }}>Bedtime Chronicles</span>
          </div>

          {/* Primary H2 Heading wrapped in HeadingReveal with reveal-fade-up logic */}
          <HeadingReveal
            as="h2"
            delay={100}
            className="text-3xl sm:text-5xl font-bold font-serif tracking-tight"
            style={{ color: 'var(--color-text-heading)' }}
          >
            <TextAnimation divideBy="word">
              Our Story
            </TextAnimation>
          </HeadingReveal>

          <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            Follow the glowing constellation path to see how a sleepy little skull baby became the chief architect of sweet dreams.
          </p>
        </div>

        {/* Timeline with Glowing Dotted Path */}
        <div className="relative">
          {/* Central glowing vertical dotted line for desktop */}
          <div className="hidden md:block absolute left-1/2 top-8 bottom-8 -translate-x-1/2 w-0.5 border-l-2 border-dashed border-pink-400/40 pointer-events-none" />

          {/* Chapters mapped with staggered reveal-delay-* classes */}
          <div className="space-y-12 sm:space-y-16">
            {CHAPTERS.map((ch, idx) => {
              const delayClass = CHAPTER_DELAYS[idx % CHAPTER_DELAYS.length];
              return (
                <div
                  key={ch.number}
                  className={`w-full reveal-fade-up ${delayClass} ${
                    isRevealed ? 'is-revealed' : ''
                  }`}
                >
                  <StoryChapterItem
                    chapter={ch}
                    index={idx}
                    isParentRevealed={isRevealed}
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

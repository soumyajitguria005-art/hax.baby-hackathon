import { useState, useEffect, useRef, useCallback } from 'react';
import { PipState } from './types/character';
import { OpeningScene } from './components/opening/OpeningScene';
import { GhostCursor } from './components/cursor/GhostCursor';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { ProjectCardsSection } from './components/sections/ProjectCardsSection';
import { StorySection } from './components/sections/StorySection';
import { DreamDeliverySection } from './components/sections/DreamDeliverySection';
import { CharacterPlayground } from './components/character/CharacterPlayground';
import { Footer } from './components/layout/Footer';
import { soundEngine } from './utils/soundEffects';
import { useIntersectionObserver } from './hooks/useIntersectionObserver';
import { GuestbookSection } from './components/sections/GuestbookSection';
import { ChaosModeOverlay } from './components/effects/ChaosModeOverlay';
import { ParallaxClouds, SectionDivider, StarryConstellation } from './components/effects';

export default function App() {
  const [showOpening, setShowOpening] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const hasWoken = sessionStorage.getItem('pip_woken_session_v1');
        if (hasWoken === 'true') return false;
      } catch {
        // storage disabled
      }
    }
    return true;
  });
  const [heroPipState, setHeroPipState] = useState<PipState>('idle');
  const [companionPipState, setCompanionPipState] = useState<PipState>('idle');
  const isUserSelectedStateRef = useRef<boolean>(false);
  const [chaosMode, setChaosMode] = useState<boolean>(false);
  const [theme, setTheme] = useState<'day' | 'night'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pip-dream-theme');
      if (saved === 'day' || saved === 'night') return saved;
    }
    return 'night';
  });
  const [enableTilt, setEnableTilt] = useState<boolean>(true);
  const [soundMuted, setSoundMuted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pip-dream-sound-muted');
      if (saved !== null) return saved === 'true';
    }
    return true; // Start muted by default
  });

  // Custom Intersection Observer hooks providing isRevealed state for section wrapping
  const { ref: projectCardsSectionRef, isRevealed: isProjectCardsRevealed } =
    useIntersectionObserver<HTMLDivElement>({
      threshold: 0.1,
      triggerOnce: true,
    });

  const { ref: storySectionRef, isRevealed: isStoryRevealed } =
    useIntersectionObserver<HTMLDivElement>({
      threshold: 0.1,
      triggerOnce: true,
    });

  const { ref: dreamDeliveryRef, isRevealed: isDreamDeliveryRevealed } =
    useIntersectionObserver<HTMLDivElement>({
      threshold: 0.1,
      triggerOnce: true,
    });

  // Inactivity detection timer (10 seconds)
  const inactivityTimerRef = useRef<number | null>(null);
  const isBusyRef = useRef<boolean>(false);

  // Sync theme with HTML data-theme attribute & localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('pip-dream-theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  // Sound Engine sync & localStorage
  useEffect(() => {
    soundEngine.setMuted(soundMuted);
    try {
      localStorage.setItem('pip-dream-sound-muted', String(soundMuted));
    } catch {
      // ignore
    }
  }, [soundMuted]);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = window.setTimeout(() => {
      if (!isBusyRef.current && !isUserSelectedStateRef.current) {
        setHeroPipState((curr) => (curr !== 'flying' && curr !== 'sleeping' ? 'sleepy' : curr));
        setCompanionPipState((curr) => (curr !== 'flying' && curr !== 'sleeping' ? 'sleepy' : curr));
      }
    }, 12000);
  }, []);

  useEffect(() => {
    const handleUserActivity = () => {
      if (!isUserSelectedStateRef.current) {
        setHeroPipState((curr) => (curr === 'sleepy' ? 'idle' : curr));
        setCompanionPipState((curr) => (curr === 'sleepy' ? 'idle' : curr));
      }
      resetInactivityTimer();
    };

    window.addEventListener('mousemove', handleUserActivity, { passive: true });
    window.addEventListener('keydown', handleUserActivity, { passive: true });
    window.addEventListener('click', handleUserActivity, { passive: true });

    resetInactivityTimer();

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [resetInactivityTimer]);

  const handleWakePip = () => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('pip_woken_session_v1', 'true');
      } catch {
        // storage disabled
      }
    }
    setShowOpening(false);
    setHeroPipState('excited');
    setTimeout(() => {
      setHeroPipState('idle');
    }, 1800);
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'night' ? 'day' : 'night';
    setTheme(nextTheme);
    setHeroPipState(nextTheme === 'night' ? 'sleepy' : 'happy');
    setCompanionPipState(nextTheme === 'night' ? 'sleepy' : 'happy');
    soundEngine.playGentlePop();

    setTimeout(() => {
      setHeroPipState('idle');
      setCompanionPipState('idle');
    }, 2000);
  };

  const handleToggleSound = () => {
    const nextMuted = !soundMuted;
    setSoundMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
    if (!nextMuted) {
      soundEngine.playStarSparkle();
    }
  };

  const handleSecretStarUnlock = () => {
    setHeroPipState('surprised');
    setCompanionPipState('surprised');
    setTimeout(() => {
      setHeroPipState('happy');
      setCompanionPipState('happy');
      setTimeout(() => {
        setHeroPipState('idle');
        setCompanionPipState('idle');
      }, 2500);
    }, 1800);
  };

  const handlePipStateChange = useCallback((st: PipState) => {
    setHeroPipState(st);
    setCompanionPipState(st);
  }, []);

  return (
    <div className="min-h-screen relative overflow-x-hidden transition-colors duration-500">
      {/* FULL-SCREEN MIDNIGHT NURSERY OPENING SCENE */}
      {showOpening && <OpeningScene onWakePip={handleWakePip} />}

      {/* CUTE MINIMAL CUSTOM GHOST CURSOR WITH TRAILING MOTION & SPARKLES */}
      <GhostCursor theme={theme} chaosMode={chaosMode} />

      {/* SUBTLE HORIZONTAL PARALLAX BACKGROUND CLOUD SVG ELEMENTS TIED TO SCROLL */}
      <ParallaxClouds theme={theme} />

      {/* STARRY CONSTELLATION OVERLAY (Active in Night mode: click stars to connect lines & play chimes) */}
      <StarryConstellation theme={theme} />

      {/* RESPONSIVE RETRO CHAOS MODE OVERLAY (OFF BY DEFAULT) */}
      <ChaosModeOverlay
        active={chaosMode}
        onDisable={() => setChaosMode(false)}
        theme={theme}
      />

      {/* FLOATING LIQUID GLASS NAVIGATION */}
      <Navbar
        theme={theme}
        onToggleTheme={handleToggleTheme}
        soundMuted={soundMuted}
        onToggleSound={handleToggleSound}
        onSecretStarUnlock={handleSecretStarUnlock}
        chaosMode={chaosMode}
        onToggleChaosMode={() => setChaosMode(!chaosMode)}
        onReplayIntro={() => setShowOpening(true)}
      />

      {/* MAIN STORYBOOK SECTIONS */}
      <main className="space-y-4">
        {/* HERO SECTION */}
        <HeroSection
          pipState={heroPipState}
          onPipStateChange={handlePipStateChange}
          enableTilt={enableTilt}
          theme={theme}
        />

        {/* NARRATIVE DIVIDER: Hero -> Inventions */}
        <SectionDivider
          variant="wave"
          theme={theme}
          badgeIcon="sparkle"
          badgeLabel="Dream Studio"
        />

        {/* 3D FLIP PROJECT CARDS SECTION WRAPPED IN INTERSECTION OBSERVER */}
        <div
          ref={projectCardsSectionRef}
          className={`reveal-fade-up ${isProjectCardsRevealed ? 'is-revealed' : ''}`}
        >
          <ProjectCardsSection
            isRevealed={isProjectCardsRevealed}
            onPipStateChange={handlePipStateChange}
            theme={theme}
          />
        </div>

        {/* NARRATIVE DIVIDER: Inventions -> Blueprints */}
        <SectionDivider
          variant="constellation"
          theme={theme}
          badgeIcon="star"
          badgeLabel="Dream Blueprints"
        />

        {/* ABOUT SECTION: Dream Engineering Blueprints */}
        <AboutSection
          onHoverProject={() => {
            setHeroPipState('curious');
            setCompanionPipState('curious');
          }}
          onLeaveProject={() => {
            setHeroPipState('idle');
            setCompanionPipState('idle');
          }}
          theme={theme}
          enableTilt={enableTilt}
        />

        {/* NARRATIVE DIVIDER: Blueprints -> Bedtime Chronicles */}
        <SectionDivider
          variant="arch"
          theme={theme}
          badgeIcon="moon"
          badgeLabel="Bedtime Chronicles"
        />

        {/* OUR STORY: 3 Illustrated Timeline Chapters WRAPPED IN INTERSECTION OBSERVER */}
        <div
          ref={storySectionRef}
          className={`reveal-fade-up ${isStoryRevealed ? 'is-revealed' : ''}`}
        >
          <StorySection isRevealed={isStoryRevealed} />
        </div>

        {/* NARRATIVE DIVIDER: Chronicles -> Flight Routes */}
        <SectionDivider
          variant="horizon"
          theme={theme}
          badgeIcon="cloud"
          badgeLabel="Delivery Routes"
        />

        {/* DREAM DELIVERY ROUTES SECTION WRAPPED IN INTERSECTION OBSERVER */}
        <div
          ref={dreamDeliveryRef}
          className={`reveal-fade-up ${isDreamDeliveryRevealed ? 'is-revealed' : ''}`}
        >
          <DreamDeliverySection
            theme={theme}
            enableTilt={enableTilt}
            isRevealed={isDreamDeliveryRevealed}
            onStartDelivery={() => {
              setHeroPipState('flying');
              setCompanionPipState('flying');
              setTimeout(() => {
                setHeroPipState('happy');
                setCompanionPipState('happy');
              }, 3000);
            }}
          />
        </div>

        {/* NARRATIVE DIVIDER: Routes -> Character Studio */}
        <SectionDivider
          variant="wave"
          theme={theme}
          badgeIcon="sparkle"
          badgeLabel="Character Studio"
          flip={true}
        />

        {/* CHARACTER ENGINE STUDIO & STATE INSPECTOR */}
        <section id="character-studio" className="py-20 lg:py-24 border-t border-slate-800/40">
          <div className="max-w-6xl mx-auto px-6 lg:px-12">
            <CharacterPlayground
              currentState={companionPipState}
              onSelectState={(st) => {
                isUserSelectedStateRef.current = true;
                setCompanionPipState(st);
                setHeroPipState(st);
              }}
              enableTilt={enableTilt}
              onToggleTilt={() => setEnableTilt(!enableTilt)}
              soundMuted={soundMuted}
              onToggleSound={handleToggleSound}
              theme={theme}
            />
          </div>
        </section>

        {/* NARRATIVE DIVIDER: Studio -> Starlight Notes */}
        <SectionDivider
          variant="wave"
          theme={theme}
          badgeIcon="sparkle"
          badgeLabel="Starlight Register"
        />

        {/* LIVE GUESTBOOK SECTION */}
        <GuestbookSection theme={theme} />

        {/* NARRATIVE DIVIDER: Guestbook -> Footer */}
        <SectionDivider
          variant="constellation"
          theme={theme}
          badgeIcon="moon"
          badgeLabel="Slumber Shift"
        />
      </main>

      {/* FOOTER */}
      <Footer theme={theme} enableTilt={enableTilt} />
    </div>
  );
}

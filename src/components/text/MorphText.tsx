import React, { useId, useState, useEffect } from "react";
import { cn } from "../../lib/utils";

export interface MorphTextProps {
  /** Array of words / phrases to cycle through. */
  words?: string[];
  /** Duration (ms) each word is displayed before transitioning. */
  interval?: number;
  /** Optional subtext rendered beneath the morphing word. */
  subtext?: string;
  /** Font size passed as a CSS value (e.g. "clamp(1.5rem, 4vw, 3rem)"). */
  fontSize?: string;
  /** Font family. */
  fontFamily?: string;
  /** Extra CSS classes on the root wrapper. */
  className?: string;
  /** Extra CSS classes on the morphing text container. */
  textClassName?: string;
  /** Extra CSS classes on the subtext element. */
  subtextClassName?: string;
}

export function MorphText({
  words = ["DREAM", "CREATE", "DELIVER", "REST"],
  interval = 3000,
  subtext,
  fontSize = "clamp(1.5rem, 3.5vw, 2.5rem)",
  fontFamily = "inherit",
  className,
  textClassName,
  subtextClassName,
}: MorphTextProps) {
  const uid = useId().replace(/:/g, "");
  const filterId = `morph-threshold-${uid}`;
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);

    const listener = () => setReducedMotion(media.matches);
    try {
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    } catch {
      media.addListener?.(listener);
      return () => media.removeListener?.(listener);
    }
  }, []);

  const totalDuration = (interval / 1000) * words.length;
  const wordDuration = interval / 1000;

  const wordStyles = words.map((_, i) => ({
    animationDelay: `${i * wordDuration}s`,
    animationDuration: `${totalDuration}s`,
  }));

  if (reducedMotion) {
    return (
      <div className={cn("relative flex flex-col items-center", className)}>
        <span
          className={cn("font-bold", textClassName)}
          style={{ fontSize, fontFamily }}
        >
          {words[0]}
        </span>
        {subtext && (
          <p className={cn("mt-2 text-xs text-slate-400 uppercase tracking-widest", subtextClassName)}>
            {subtext}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cn("morph-text-root relative flex flex-col items-center", className)}>
      {/* Hidden threshold SVG filter */}
      <svg
        aria-hidden="true"
        focusable="false"
        style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
      >
        <defs>
          <filter id={filterId}>
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Morphing word container */}
      <div
        className={cn("morph-text-container relative select-none", textClassName)}
        style={{
          fontSize,
          fontWeight: 700,
          filter: `url(#${filterId})`,
          fontFamily,
        }}
      >
        <div
          className="morph-word-rotator relative flex items-center justify-center"
          style={{ height: "1.25em", minWidth: "10ch" }}
        >
          {words.map((word, i) => (
            <span
              key={`${word}-${i}`}
              className="morph-word absolute"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                opacity: 0,
                whiteSpace: "nowrap",
                animationName: "morph-word-rotate",
                animationTimingFunction: "ease-in-out",
                animationIterationCount: "infinite",
                animationFillMode: "both",
                ...wordStyles[i],
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* Optional subtext */}
      {subtext && (
        <p
          className={cn(
            "morph-subtext mt-2 uppercase tracking-[0.2em] text-xs font-semibold text-slate-400",
            subtextClassName
          )}
          style={{
            opacity: 0,
            animation: "morph-fade-up 0.8s ease-out 0.4s forwards",
            fontFamily,
          }}
        >
          {subtext}
        </p>
      )}

      {/* Scoped CSS animations */}
      <style>{`
        @keyframes morph-word-rotate {
          0% {
            opacity: 0;
            filter: blur(14px);
            transform: translate(-50%, -50%) scale(0.85);
          }
          6% {
            opacity: 0.6;
            filter: blur(8px);
          }
          18%, 38% {
            opacity: 1;
            filter: blur(0px);
            transform: translate(-50%, -50%) scale(1);
          }
          48% {
            opacity: 0.6;
            filter: blur(8px);
          }
          55%, 100% {
            opacity: 0;
            filter: blur(14px);
            transform: translate(-50%, -50%) scale(1.15);
          }
        }

        @keyframes morph-fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default MorphText;

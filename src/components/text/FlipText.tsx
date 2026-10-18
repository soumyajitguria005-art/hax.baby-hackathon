import React, { useMemo, useState, useEffect } from "react";
import { cn } from "../../lib/utils";

export interface FlipTextProps {
  /** Additional CSS classes for the wrapper */
  className?: string;
  /** The text content to animate */
  children: string;
  /** Duration of the flip animation in seconds */
  duration?: number;
  /** Initial delay before animation starts in seconds */
  delay?: number;
  /** Whether the animation should loop infinitely */
  loop?: boolean;
  /** Custom separator for splitting text */
  separator?: string;
  /** Whether all characters should animate together */
  together?: boolean;
}

export function FlipText({
  className,
  children,
  duration = 2.4,
  delay = 0,
  loop = true,
  separator = " ",
  together = false,
}: FlipTextProps) {
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

  const words = useMemo(() => children.split(separator), [children, separator]);
  const totalChars = children.length;

  const getCharIndex = (wordIndex: number, charIndex: number) => {
    let index = 0;
    for (let i = 0; i < wordIndex; i++) {
      index += words[i].length + (separator === " " ? 1 : separator.length);
    }
    return index + charIndex;
  };

  if (reducedMotion) {
    return <span className={cn("inline-block", className)}>{children}</span>;
  }

  return (
    <div
      className={cn("flip-text-wrapper inline-block leading-none", className)}
      style={{ perspective: "1000px" }}
    >
      {words.map((word, wordIndex) => {
        const chars = word.split("");

        return (
          <span
            key={wordIndex}
            className="word inline-block whitespace-nowrap"
            style={{ transformStyle: "preserve-3d" }}
          >
            {chars.map((char, charIndex) => {
              const currentGlobalIndex = getCharIndex(wordIndex, charIndex);

              let calculatedDelay = delay;
              if (!together) {
                const normalizedIndex = currentGlobalIndex / Math.max(1, totalChars);
                const sineValue = Math.sin(normalizedIndex * (Math.PI / 2));
                calculatedDelay = sineValue * (duration * 0.25) + delay;
              }

              return (
                <span
                  key={charIndex}
                  className="flip-char inline-block relative"
                  data-char={char}
                  style={
                    {
                      "--flip-duration": `${duration}s`,
                      "--flip-delay": `${calculatedDelay}s`,
                      "--flip-iteration": loop ? "infinite" : "1",
                      transformStyle: "preserve-3d",
                    } as React.CSSProperties
                  }
                >
                  {char}
                </span>
              );
            })}
            {separator === " " && wordIndex < words.length - 1 && (
              <span className="whitespace inline-block">&nbsp;</span>
            )}
            {separator !== " " && wordIndex < words.length - 1 && (
              <span className="separator inline-block">{separator}</span>
            )}
          </span>
        );
      })}
    </div>
  );
}

export default FlipText;

import React from 'react';

export type GhostExpression = 'default' | 'hover' | 'click' | 'following' | 'blink' | 'curious';

interface GhostArtworkProps {
  expression?: GhostExpression;
  theme?: 'day' | 'night';
  tilt?: number;
  starGlow?: boolean;
}

export const GhostArtwork: React.FC<GhostArtworkProps> = ({
  expression = 'default',
  theme = 'night',
  tilt = 0,
  starGlow = false,
}) => {
  const isNight = theme === 'night';

  return (
    <svg
      viewBox="0 0 80 80"
      className="w-full h-full select-none pointer-events-none transition-transform duration-200"
      style={{
        transform: `rotate(${tilt}deg)`,
        filter: isNight
          ? 'drop-shadow(0 4px 12px rgba(244, 114, 182, 0.45)) drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
          : 'drop-shadow(0 4px 10px rgba(163, 64, 99, 0.25)) drop-shadow(0 2px 4px rgba(92, 64, 51, 0.15))',
      }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Soft Warm Ivory-White Body Gradient */}
        <linearGradient id="ghostIvoryGrad" x1="20%" y1="0%" x2="40%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#FFFDF8" />
          <stop offset="100%" stopColor="#FDEAF2" />
        </linearGradient>

        {/* Luminous Inner Glow Gradient */}
        <radialGradient id="ghostInnerShade" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="80%" stopColor="#FFF8F1" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#F9A8D4" stopOpacity="0.3" />
        </radialGradient>

        {/* Golden Star Gradient */}
        <linearGradient id="ghostStarGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="35%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>

        {/* Star Glow Filter */}
        <filter id="starGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* AMBIENT NIGHT RIM LIGHTING */}
      {isNight && (
        <path
          d="M 36 10
             C 20 10, 10 22, 10 38
             C 10 52, 14 60, 19 63
             C 24 66, 29 60, 34 63
             C 39 66, 44 60, 49 63
             C 54 66, 59 60, 65 56
             C 70 51, 72 42, 68 34
             C 64 26, 58 16, 48 12
             C 42 10, 39 10, 36 10 Z"
          fill="none"
          stroke="#F472B6"
          strokeWidth="4"
          opacity="0.35"
        />
      )}

      {/* MAIN GHOST SILHOUETTE BODY WITH FLOWING WAVY BOTTOM */}
      <path
        d="M 36 10
           C 20 10, 10 22, 10 38
           C 10 52, 14 60, 19 63
           C 24 66, 29 60, 34 63
           C 39 66, 44 60, 49 63
           C 54 66, 59 60, 65 56
           C 70 51, 72 42, 68 34
           C 64 26, 58 16, 48 12
           C 42 10, 39 10, 36 10 Z"
        fill="url(#ghostIvoryGrad)"
        stroke="#5C4033"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* INNER HIGHLIGHT OVERLAY FOR DEPTH */}
      <path
        d="M 36 12
           C 22 12, 13 23, 13 37
           C 13 49, 16 56, 20 59
           C 24 61, 28 57, 34 60
           C 38 62, 43 57, 48 60
           C 53 62, 57 57, 62 53
           C 66 49, 68 41, 65 34
           C 61 27, 56 18, 47 14
           C 42 12, 39 12, 36 12 Z"
        fill="url(#ghostInnerShade)"
      />

      {/* SOFT BLUSH-PINK CHEEKS */}
      <circle
        cx="21"
        cy="42"
        r="4.2"
        fill="#F472B6"
        opacity={expression === 'hover' ? 0.85 : 0.55}
      />
      <circle
        cx="49"
        cy="40"
        r="4.2"
        fill="#F472B6"
        opacity={expression === 'hover' ? 0.85 : 0.55}
      />

      {/* ======================================================== */}
      {/* FACIAL EXPRESSIONS */}
      {/* ======================================================== */}
      {expression === 'hover' ? (
        // Happy, ecstatic ^ ^ eyes and joyful open smiling mouth
        <g id="ghost-face-hover">
          {/* Left happy curved eye */}
          <path
            d="M 21 31 Q 26 24, 31 31"
            stroke="#4A3228"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
          {/* Right happy curved eye */}
          <path
            d="M 39 29 Q 44 22, 49 29"
            stroke="#4A3228"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
          {/* Joyful open mouth with cute tongue */}
          <path
            d="M 32 37 Q 35 44, 38 37 Z"
            fill="#E11D48"
            stroke="#4A3228"
            strokeWidth="1.6"
          />
          <path
            d="M 33 40 Q 35 43, 37 40"
            stroke="#FDA4AF"
            strokeWidth="1.2"
            fill="none"
          />
          {/* Small side sparkles */}
          <text x="56" y="24" fill="#F472B6" fontSize="10" fontWeight="bold">✦</text>
        </g>
      ) : expression === 'click' ? (
        // Playful wink and squeezed smile
        <g id="ghost-face-click">
          {/* Left winking curved eye */}
          <path
            d="M 21 33 Q 26 38, 31 33"
            stroke="#4A3228"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
          {/* Right wide sparkling eye */}
          <ellipse cx="44" cy="30" rx="3.6" ry="4.5" fill="#4A3228" />
          <circle cx="42.8" cy="28.8" r="1.5" fill="#FFFFFF" />
          <circle cx="45.5" cy="31.8" r="0.9" fill="#FDE047" />
          {/* Excited 'o' mouth */}
          <ellipse cx="35" cy="40" rx="2.2" ry="3.2" fill="#4A3228" />
          {/* Tiny floating love heart */}
          <path
            d="M 52 18 C 50 15, 47 16, 47 18 C 47 21, 52 24, 52 24 C 52 24, 57 21, 57 18 C 57 16, 54 15, 52 18 Z"
            fill="#F43F5E"
            opacity="0.95"
          />
        </g>
      ) : expression === 'curious' ? (
        // Inquisitive head tilt expression with attentive wide eyes & '?'
        <g id="ghost-face-curious">
          <ellipse cx="26" cy="32" rx="3.4" ry="4.4" fill="#4A3228" />
          <circle cx="25" cy="30.5" r="1.4" fill="#FFFFFF" />
          <circle cx="27.5" cy="33.5" r="0.8" fill="#FDE047" />

          <ellipse cx="44" cy="29" rx="3.8" ry="4.8" fill="#4A3228" />
          <circle cx="43" cy="27.5" r="1.6" fill="#FFFFFF" />
          <circle cx="45.8" cy="30.8" r="0.9" fill="#FDE047" />

          {/* Wondering slight smile */}
          <path
            d="M 33 39 Q 36 43, 39 39"
            stroke="#4A3228"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Question mark reaction */}
          <text x="56" y="24" fill="#C084FC" fontSize="12" fontWeight="bold">?</text>
        </g>
      ) : expression === 'blink' ? (
        // Calm sleepy closed eye slits
        <g id="ghost-face-blink">
          <path d="M 23 33 L 30 33" stroke="#4A3228" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M 40 31 L 47 31" stroke="#4A3228" strokeWidth="2.6" strokeLinecap="round" />
          <path
            d="M 33 39 Q 36 41.5, 38 39"
            stroke="#4A3228"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      ) : (
        // Default & Following: Large expressive cocoa eyes with dual highlights (white + golden star reflection)
        <g id="ghost-face-default">
          {/* Left Eye */}
          <ellipse cx="26" cy="32" rx="3.6" ry="4.8" fill="#4A3228" />
          <circle cx="24.8" cy="30.2" r="1.5" fill="#FFFFFF" />
          <circle cx="27.6" cy="33.8" r="0.9" fill="#FDE047" />

          {/* Right Eye */}
          <ellipse cx="44" cy="30" rx="3.6" ry="4.8" fill="#4A3228" />
          <circle cx="42.8" cy="28.2" r="1.5" fill="#FFFFFF" />
          <circle cx="45.6" cy="31.8" r="0.9" fill="#FDE047" />

          {/* Tiny adorable smile */}
          <path
            d="M 33 38 Q 35.5 42, 38 38"
            stroke="#4A3228"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      )}

      {/* ======================================================== */}
      {/* SMALL GOLDEN STAR ACCESSORY ON HEAD */}
      {/* ======================================================== */}
      <g id="ghost-star-accessory" transform="translate(48, 8)">
        {/* Glow halo when active */}
        <circle
          cx="7"
          cy="7"
          r={starGlow ? 12 : 8}
          fill="#FDE047"
          opacity={starGlow ? 0.65 : 0.3}
          filter="url(#starGlowFilter)"
        />

        {/* 5-pointed golden star */}
        <polygon
          points="7,0 8.8,4.6 13.7,5 10.1,8.4 11.2,13.3 7,10.8 2.8,13.3 3.9,8.4 0.3,5 5.2,4.6"
          fill="url(#ghostStarGold)"
          stroke="#92400E"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />

        {/* Tiny star shine highlight */}
        <circle cx="5.8" cy="4.8" r="1.1" fill="#FFFFFF" />
      </g>
    </svg>
  );
};

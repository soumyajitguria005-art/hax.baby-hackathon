import React from 'react';
import { PipPosture, PipEmotion } from '../../types/character';

interface PipArtworkProps {
  posture: PipPosture;
  emotion: PipEmotion;
  theme?: 'day' | 'night';
  lanternGlow?: boolean;
}

export const PipArtwork: React.FC<PipArtworkProps> = ({
  posture,
  emotion,
  theme = 'night',
  lanternGlow = true,
}) => {
  const isNight = theme === 'night';

  return (
    <svg
      viewBox="0 0 240 240"
      className="w-full h-full drop-shadow-md select-none transition-all duration-300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Amber Eye Glow Filter */}
        <filter id="eyeGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Lantern Glow Filter */}
        <filter id="lanternGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Ambient Cloud Gradient */}
        <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#F1F5F9" stopOpacity="0.9" />
          <stop offset="100%" stopColor={isNight ? '#C7D2FE' : '#E2E8F0'} stopOpacity="0.8" />
        </linearGradient>

        {/* Nightcap Pink Gradient */}
        <linearGradient id="hatGrad" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="60%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#DB2777" />
        </linearGradient>

        {/* Nightcap Cuff & Trim */}
        <linearGradient id="cuffGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FCE7F3" />
        </linearGradient>

        {/* Pajamas Lavender Gradient */}
        <linearGradient id="pajamaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>

        {/* Glowing Star Gold Gradient */}
        <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>

        {/* Lantern Brass Gradient */}
        <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
      </defs>

      {/* BACKGROUND AMBIENT GLOW */}
      {isNight && (
        <circle
          cx="120"
          cy="120"
          r="95"
          fill="url(#starGrad)"
          opacity="0.08"
          className="animate-pulse"
        />
      )}

      {/* ======================================================== */}
      {/* 1. CLOUD BASE (Sitting / Flying / Sleeping) */}
      {/* ======================================================== */}
      {posture !== 'flying' && (
        <g id="cloud-base" className="transition-transform duration-500">
          <ellipse cx="120" cy="195" rx="76" ry="24" fill="url(#cloudGrad)" />
          <circle cx="70" cy="190" r="28" fill="url(#cloudGrad)" />
          <circle cx="110" cy="182" r="32" fill="url(#cloudGrad)" />
          <circle cx="155" cy="186" r="30" fill="url(#cloudGrad)" />
          <circle cx="180" cy="195" r="20" fill="url(#cloudGrad)" />
          <ellipse cx="120" cy="198" rx="60" ry="12" fill="#E2E8F0" opacity="0.4" />
        </g>
      )}

      {posture === 'flying' && (
        <g id="flying-trail" className="transition-transform duration-500">
          {/* Flying cloud speed stream */}
          <path
            d="M20 185 Q 70 190, 120 175 Q 180 160, 220 180"
            stroke="#FDE047"
            strokeWidth="3"
            strokeDasharray="6 6"
            opacity="0.6"
          />
          <ellipse cx="100" cy="170" rx="55" ry="18" fill="url(#cloudGrad)" />
          <circle cx="65" cy="168" r="20" fill="url(#cloudGrad)" />
          <circle cx="130" cy="166" r="24" fill="url(#cloudGrad)" />
          {/* Stardust particles */}
          <circle cx="45" cy="155" r="3" fill="#FDE047" className="animate-ping" />
          <circle cx="30" cy="180" r="2" fill="#FEF08A" />
          <circle cx="195" cy="150" r="2.5" fill="#FDE047" />
        </g>
      )}

      {/* ======================================================== */}
      {/* 2. PROPS: WORKBENCH / MUSIC BOX (if applicable) */}
      {/* ======================================================== */}
      {posture === 'working' && (
        <g id="drafting-desk">
          <rect x="50" y="170" width="140" height="24" rx="4" fill="#92400E" />
          <rect x="54" y="166" width="132" height="6" rx="2" fill="#B45309" />
          {/* Blue Dream Blueprint */}
          <rect x="75" y="162" width="55" height="18" rx="2" fill="#1E3A8A" stroke="#60A5FA" strokeWidth="1" />
          <path d="M82 168 L 105 168 M82 173 L 118 173" stroke="#93C5FD" strokeWidth="1" />
          <circle cx="112" cy="168" r="2" fill="#FDE047" />
          {/* Mini Brass Ruler */}
          <rect x="135" y="165" width="30" height="5" rx="1" fill="#FBBF24" />
        </g>
      )}

      {posture === 'with-music-box' && (
        <g id="music-box">
          <rect x="145" y="152" width="52" height="36" rx="6" fill="#7C3AED" stroke="#FBBF24" strokeWidth="2" />
          <rect x="142" y="148" width="58" height="8" rx="3" fill="#6D28D9" />
          <circle cx="171" cy="166" r="8" fill="#FDE047" opacity="0.9" />
          <circle cx="171" cy="166" r="4" fill="#7C3AED" />
          {/* Wind-up key on top */}
          <path d="M192 148 L 198 140 M195 137 A 4 4 0 1 1 202 143" stroke="#FBBF24" strokeWidth="2" fill="none" />
        </g>
      )}

      {/* ======================================================== */}
      {/* 3. BODY & PAJAMAS */}
      {/* ======================================================== */}
      {posture === 'sleeping' ? (
        // Curled up sleeping posture
        <g id="body-sleeping">
          <ellipse cx="120" cy="155" rx="42" ry="32" fill="url(#pajamaGrad)" />
          {/* Sleeping bunny companion */}
          <g id="plush-bunny" transform="translate(145, 140)">
            <ellipse cx="14" cy="18" rx="12" ry="14" fill="#FFFFFF" />
            <ellipse cx="12" cy="6" rx="3.5" ry="8" fill="#FFFFFF" transform="rotate(-15 12 6)" />
            <ellipse cx="18" cy="6" rx="3.5" ry="8" fill="#FFFFFF" transform="rotate(10 18 6)" />
            <ellipse cx="12" cy="6" rx="2" ry="6" fill="#FCE7F3" transform="rotate(-15 12 6)" />
            <ellipse cx="18" cy="6" rx="2" ry="6" fill="#FCE7F3" transform="rotate(10 18 6)" />
            {/* Bunny eyes & nose */}
            <path d="M9 16 Q 11 18, 13 16 M15 16 Q 17 18, 19 16" stroke="#94A3B8" strokeWidth="1" fill="none" />
            <circle cx="14" cy="18" r="1.5" fill="#F472B6" />
          </g>
        </g>
      ) : (
        // Upright / Sitting / Flying / Working posture
        <g id="body-standard">
          <ellipse cx="120" cy="156" rx="38" ry="30" fill="url(#pajamaGrad)" />
          {/* Pajama buttons or stars */}
          <circle cx="120" cy="148" r="2.5" fill="#FEF08A" />
          <circle cx="120" cy="158" r="2.5" fill="#FEF08A" />
          {/* Little pajama feet */}
          <ellipse cx="98" cy="176" rx="11" ry="8" fill="url(#pajamaGrad)" />
          <ellipse cx="142" cy="176" rx="11" ry="8" fill="url(#pajamaGrad)" />
          <ellipse cx="98" cy="177" rx="7" ry="4" fill="#FCE7F3" opacity="0.6" />
          <ellipse cx="142" cy="177" rx="7" ry="4" fill="#FCE7F3" opacity="0.6" />
        </g>
      )}

      {/* ======================================================== */}
      {/* 4. PIP'S RECOGNIZABLE SKULL HEAD */}
      {/* ======================================================== */}
      <g id="head" className="transition-transform duration-300">
        {/* Skull Head Base */}
        <path
          d="M 68 114
             C 68 76, 90 60, 120 60
             C 150 60, 172 76, 172 114
             C 172 136, 160 148, 148 148
             C 142 148, 138 144, 134 144
             C 126 144, 124 146, 120 146
             C 116 146, 114 144, 106 144
             C 102 144, 98 148, 92 148
             C 80 148, 68 136, 68 114 Z"
          fill="#FFFDF7"
          stroke="#EADBCE"
          strokeWidth="1.5"
        />

        {/* Cute Inverted Heart/Triangle Nose Cavity */}
        <path
          d="M 120 120 L 116 126 Q 120 128, 124 126 Z"
          fill="#3B2E3D"
        />

        {/* Rosy Cheek Blush */}
        <circle cx="86" cy="126" r="7" fill="#F472B6" opacity={emotion === 'shy' ? '0.75' : '0.45'} />
        <circle cx="154" cy="126" r="7" fill="#F472B6" opacity={emotion === 'shy' ? '0.75' : '0.45'} />

        {/* ======================================================== */}
        {/* 5. GLOWING AMBER EYES & EXPRESSIONS */}
        {/* ======================================================== */}
        {emotion === 'sleepy' || posture === 'sleeping' ? (
          // Sleepy / Sleeping: gentle closed peaceful crescent curves
          <g id="eyes-sleepy">
            <path
              d="M 88 110 Q 98 120, 108 110"
              stroke="#D97706"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              filter="url(#eyeGlow)"
            />
            <path
              d="M 132 110 Q 142 120, 152 110"
              stroke="#D97706"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              filter="url(#eyeGlow)"
            />
            {/* Gentle smile */}
            <path d="M 116 132 Q 120 135, 124 132" stroke="#4A3E4D" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        ) : emotion === 'happy' ? (
          // Happy: crescent sparkle joyful eyes
          <g id="eyes-happy">
            <ellipse cx="98" cy="108" rx="14" ry="16" fill="#2E1C2B" />
            <ellipse cx="142" cy="108" rx="14" ry="16" fill="#2E1C2B" />
            {/* Glowing amber iris */}
            <ellipse cx="98" cy="108" rx="11" ry="13" fill="#F59E0B" filter="url(#eyeGlow)" />
            <ellipse cx="142" cy="108" rx="11" ry="13" fill="#F59E0B" filter="url(#eyeGlow)" />
            {/* 4-point star highlight */}
            <polygon points="98,99 100,105 106,107 100,109 98,115 96,109 90,107 96,105" fill="#FFFFFF" />
            <polygon points="142,99 144,105 150,107 144,109 142,115 140,109 134,107 140,105" fill="#FFFFFF" />
            {/* Wide happy open smile */}
            <path d="M 113 131 Q 120 140, 127 131 Z" fill="#E11D48" stroke="#3B2E3D" strokeWidth="1" />
          </g>
        ) : emotion === 'surprised' ? (
          // Surprised: wide circular eyes and 'O' mouth
          <g id="eyes-surprised">
            <ellipse cx="98" cy="107" rx="16" ry="17" fill="#2E1C2B" />
            <ellipse cx="142" cy="107" rx="16" ry="17" fill="#2E1C2B" />
            <ellipse cx="98" cy="107" rx="13" ry="14" fill="#FBBF24" filter="url(#eyeGlow)" />
            <ellipse cx="142" cy="107" rx="13" ry="14" fill="#FBBF24" filter="url(#eyeGlow)" />
            {/* Big sparkle stars */}
            <polygon points="98,98 101,104 107,107 101,110 98,116 95,110 89,107 95,104" fill="#FFFFFF" />
            <polygon points="142,98 145,104 151,107 145,110 142,116 139,110 133,107 139,104" fill="#FFFFFF" />
            {/* Surprised 'o' mouth */}
            <ellipse cx="120" cy="133" rx="4.5" ry="6" fill="#3B2E3D" />
          </g>
        ) : emotion === 'wink' ? (
          // Wink: playful
          <g id="eyes-wink">
            <ellipse cx="98" cy="108" rx="14" ry="15" fill="#2E1C2B" />
            <ellipse cx="98" cy="108" rx="11" ry="12" fill="#F59E0B" filter="url(#eyeGlow)" />
            <polygon points="98,100 100,105 105,107 100,109 98,114 96,109 91,107 96,105" fill="#FFFFFF" />
            {/* Winking right eye */}
            <path d="M 134 110 Q 142 118, 150 110" stroke="#4A3E4D" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 115 132 Q 121 137, 126 131" stroke="#3B2E3D" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        ) : (
          // Default / Curious / Excited / Reading / Working: calm, warm glowing amber eyes
          <g id="eyes-default">
            <ellipse cx="98" cy="108" rx="14" ry="15" fill="#2E1C2B" />
            <ellipse cx="142" cy="108" rx="14" ry="15" fill="#2E1C2B" />
            {/* Amber core */}
            <ellipse cx="98" cy="108" rx="11" ry="12" fill="#F59E0B" filter="url(#eyeGlow)" />
            <ellipse cx="142" cy="108" rx="11" ry="12" fill="#F59E0B" filter="url(#eyeGlow)" />
            {/* Star reflection pupil */}
            <polygon points="98,101 100,106 105,108 100,110 98,115 96,110 91,108 96,106" fill="#FFFFFF" />
            <polygon points="142,101 144,106 149,108 144,110 142,115 140,110 135,108 140,106" fill="#FFFFFF" />
            {/* Gentle smile */}
            <path d="M 115 132 Q 120 136, 125 132" stroke="#3B2E3D" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* ======================================================== */}
        {/* 6. PINK STARRY NIGHTCAP WITH BOW & POMPOM */}
        {/* ======================================================== */}
        <g id="nightcap">
          {/* Floppy Cap Cone draped down to the right */}
          <path
            d="M 64 88
               C 64 45, 100 24, 140 28
               C 175 32, 205 60, 210 95
               C 212 110, 195 116, 185 104
               C 176 92, 168 76, 150 72
               C 120 66, 80 72, 64 88 Z"
            fill="url(#hatGrad)"
          />

          {/* Tiny Golden Stars & Moons on the Hat */}
          <polygon points="105,42 107,45 110,46 107,47 105,50 103,47 100,46 103,45" fill="#FEF08A" opacity="0.9" />
          <polygon points="138,44 140,47 143,48 140,49 138,52 136,49 133,48 136,47" fill="#FEF08A" opacity="0.9" />
          <polygon points="172,62 173.5,64.5 176,65.5 173.5,66.5 172,69 170.5,66.5 168,65.5 170.5,64.5" fill="#FEF08A" opacity="0.9" />
          <polygon points="186,88 187.5,90.5 190,91.5 187.5,92.5 186,95 184.5,92.5 182,91.5 184.5,90.5" fill="#FEF08A" opacity="0.9" />
          {/* Crescent Moon */}
          <path d="M 122 36 A 6 6 0 0 0 128 46 A 5 5 0 0 1 122 36" fill="#FEF08A" opacity="0.95" />

          {/* Floppy Pompom at tip */}
          <circle cx="204" cy="108" r="14" fill="#FFFFFF" stroke="#FCE7F3" strokeWidth="1.5" />
          <circle cx="202" cy="106" r="11" fill="#FFFDF7" />

          {/* Fluffy Nightcap Folded Cuff Band */}
          <path
            d="M 62 86
               C 62 72, 178 72, 178 86
               C 178 98, 62 98, 62 86 Z"
            fill="url(#cuffGrad)"
            stroke="#FBCFE8"
            strokeWidth="1.5"
          />

          {/* Cute Pastel Pink Ribbon Bow on Hat */}
          <g id="ribbon-bow" transform="translate(150, 68)">
            {/* Left bow loop */}
            <path d="M 0 0 C -12 -10, -14 10, 0 2 Z" fill="#F472B6" stroke="#DB2777" strokeWidth="1" />
            {/* Right bow loop */}
            <path d="M 0 0 C 12 -10, 14 10, 0 2 Z" fill="#F472B6" stroke="#DB2777" strokeWidth="1" />
            {/* Center knot */}
            <ellipse cx="0" cy="1" rx="4" ry="4" fill="#F9A8D4" stroke="#DB2777" strokeWidth="1" />
            {/* Ribbon tails */}
            <path d="M -2 4 L -6 16 L -1 13 L 2 16 L 0 4" fill="#F472B6" />
          </g>
        </g>
      </g>

      {/* ======================================================== */}
      {/* 7. HANDS & FOREGROUND PROPS (Star, Lantern, Book) */}
      {/* ======================================================== */}
      {posture === 'holding-lantern' ? (
        // Holding Lantern prop
        <g id="holding-lantern-prop">
          {/* Little skull hands holding lantern */}
          <circle cx="100" cy="158" r="7" fill="#FFFDF7" stroke="#EADBCE" strokeWidth="1" />
          <circle cx="140" cy="158" r="7" fill="#FFFDF7" stroke="#EADBCE" strokeWidth="1" />

          {/* Brass Lantern */}
          <g id="brass-lantern" transform="translate(142, 132)">
            {/* Glow Aura */}
            {lanternGlow && (
              <circle cx="16" cy="30" r="32" fill="#F59E0B" opacity="0.3" filter="url(#lanternGlow)" />
            )}
            {/* Lantern Cap */}
            <path d="M 6 12 L 16 4 L 26 12 Z" fill="url(#brassGrad)" />
            <circle cx="16" cy="3" r="3" fill="#FBBF24" />
            {/* Glass Cage */}
            <rect x="7" y="12" width="18" height="24" rx="2" fill="#FEF3C7" fillOpacity="0.85" stroke="#B45309" strokeWidth="1.5" />
            {/* Glowing Candle Flame inside */}
            <ellipse cx="16" cy="24" rx="3.5" ry="6" fill="#F59E0B" />
            <ellipse cx="16" cy="25" rx="1.8" ry="3.5" fill="#FEF08A" />
            {/* Base */}
            <rect x="5" y="36" width="22" height="6" rx="2" fill="url(#brassGrad)" />
            {/* Handle */}
            <path d="M 10 4 A 6 6 0 0 1 22 4" stroke="#D97706" strokeWidth="1.5" fill="none" />
          </g>
        </g>
      ) : posture === 'reading' ? (
        // Reading Bedtime Storybook
        <g id="reading-book" transform="translate(80, 142)">
          {/* Open Storybook */}
          <path d="M 0 18 Q 20 12, 40 18 Q 60 12, 80 18 L 76 36 Q 58 30, 40 33 Q 22 30, 4 36 Z" fill="#FDF8ED" stroke="#CA8A04" strokeWidth="1.5" />
          {/* Spine & pages */}
          <path d="M 40 18 L 40 33" stroke="#D97706" strokeWidth="1.5" />
          <circle cx="20" cy="24" r="1.5" fill="#93C5FD" />
          <circle cx="60" cy="24" r="1.5" fill="#FBBF24" />
          {/* Hands holding the book */}
          <circle cx="14" cy="28" r="6" fill="#FFFDF7" stroke="#EADBCE" strokeWidth="1" />
          <circle cx="66" cy="28" r="6" fill="#FFFDF7" stroke="#EADBCE" strokeWidth="1" />
        </g>
      ) : posture === 'sleeping' ? null : (
        // Standard / Default: Holding Glowing Smiling Star
        <g id="holding-star" className="transition-transform duration-300">
          {/* Smiling Star */}
          <g id="smiling-star" transform="translate(100, 136)">
            {/* Star aura */}
            <circle cx="20" cy="20" r="24" fill="#FEF08A" opacity="0.35" className="animate-pulse" />
            {/* 5-point star */}
            <polygon
              points="20,2 25,14 38,15 28,24 31,37 20,30 9,37 12,24 2,15 15,14"
              fill="url(#starGrad)"
              stroke="#D97706"
              strokeWidth="1.5"
            />
            {/* Star Face */}
            <circle cx="16" cy="20" r="1.8" fill="#78350F" />
            <circle cx="24" cy="20" r="1.8" fill="#78350F" />
            <circle cx="14" cy="22" r="2.2" fill="#F472B6" opacity="0.7" />
            <circle cx="26" cy="22" r="2.2" fill="#F472B6" opacity="0.7" />
            <path d="M 18 24 Q 20 26, 22 24" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </g>
          {/* Pip's hands cuddling the star */}
          <circle cx="104" cy="158" r="6.5" fill="#FFFDF7" stroke="#EADBCE" strokeWidth="1" />
          <circle cx="136" cy="158" r="6.5" fill="#FFFDF7" stroke="#EADBCE" strokeWidth="1" />
        </g>
      )}

      {/* ======================================================== */}
      {/* 8. EMOTIONAL OVERLAYS: '?', '!!', ZZZ */}
      {/* ======================================================== */}
      {emotion === 'curious' && (
        <text
          x="172"
          y="70"
          fill="#C084FC"
          fontSize="24"
          fontWeight="bold"
          fontFamily="system-ui"
          className="animate-bounce"
        >
          ?
        </text>
      )}
      {emotion === 'excited' && (
        <text
          x="172"
          y="70"
          fill="#FBBF24"
          fontSize="24"
          fontWeight="bold"
          fontFamily="system-ui"
          className="animate-bounce"
        >
          !!
        </text>
      )}
    </svg>
  );
};

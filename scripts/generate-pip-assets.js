import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const PUBLIC_ASSETS = path.join(ROOT_DIR, 'public/assets');
const PIP_DIR = path.join(PUBLIC_ASSETS, 'pip');
const EXPRESSIONS_DIR = path.join(PIP_DIR, 'expressions');

fs.mkdirSync(EXPRESSIONS_DIR, { recursive: true });

function getSvg(posture, emotion, extra = {}) {
  const isNight = extra.theme === 'night';
  const showBackground = extra.background || false;
  const showMoon = extra.showMoon || false;
  const showSurroundingStars = extra.showSurroundingStars || false;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="512" height="512">
    <defs>
      <!-- Amber Eye Glow Filter -->
      <filter id="eyeGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>

      <!-- Lantern Glow Filter -->
      <filter id="lanternGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="12" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>

      <!-- Cloud Gradient -->
      <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.98" />
        <stop offset="60%" stop-color="#F8FAFC" stop-opacity="0.95" />
        <stop offset="100%" stop-color="#E2E8F0" stop-opacity="0.9" />
      </linearGradient>

      <!-- Nightcap Pink Gradient -->
      <linearGradient id="hatGrad" x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stop-color="#F472B6" />
        <stop offset="60%" stop-color="#EC4899" />
        <stop offset="100%" stop-color="#DB2777" />
      </linearGradient>

      <!-- Nightcap Cuff Trim -->
      <linearGradient id="cuffGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="100%" stop-color="#FCE7F3" />
      </linearGradient>

      <!-- Pajamas Lavender/Cream Gradient -->
      <linearGradient id="pajamaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFDF7" />
        <stop offset="50%" stop-color="#F5F3FF" />
        <stop offset="100%" stop-color="#DDD6FE" />
      </linearGradient>

      <!-- Glowing Star Gold Gradient -->
      <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FEF08A" />
        <stop offset="50%" stop-color="#FDE047" />
        <stop offset="100%" stop-color="#F59E0B" />
      </linearGradient>

      <!-- Brass Gradient -->
      <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FCD34D" />
        <stop offset="50%" stop-color="#D97706" />
        <stop offset="100%" stop-color="#78350F" />
      </linearGradient>
    </defs>

    ${showBackground ? `
      <!-- Soft Cream Celestial Background -->
      <rect width="400" height="400" rx="32" fill="#FAF6ED" />
      <!-- Subtle warm halo -->
      <circle cx="200" cy="200" r="160" fill="#FEF3C7" opacity="0.35" />
    ` : ''}

    ${showMoon ? `
      <!-- Sleepy Crescent Moon in background -->
      <g id="sleepy-moon" transform="translate(290, 60)">
        <path d="M 40 0 A 36 36 0 1 0 76 56 A 30 30 0 1 1 40 0 Z" fill="#FDE047" stroke="#F59E0B" stroke-width="1.5" />
        <!-- Sleeping moon face -->
        <path d="M 46 36 Q 52 42, 58 36" stroke="#92400E" stroke-width="2" stroke-linecap="round" fill="none" />
        <circle cx="44" cy="40" r="3" fill="#F472B6" opacity="0.6" />
      </g>
    ` : ''}

    ${showSurroundingStars ? `
      <!-- Little twinkling stars and sparkles -->
      <g id="sparkle-stars">
        <polygon points="60,80 62,86 68,88 62,90 60,96 58,90 52,88 58,86" fill="#FDE047" />
        <polygon points="90,50 91.5,54.5 96,56 91.5,57.5 90,62 88.5,57.5 84,56 88.5,54.5" fill="#FDE047" />
        <polygon points="330,160 331.5,164.5 336,166 331.5,167.5 330,172 328.5,167.5 324,166 328.5,164.5" fill="#FDE047" />
        <polygon points="70,250 71.5,254.5 76,256 71.5,257.5 70,262 68.5,257.5 64,256 68.5,254.5" fill="#FDE047" />
        <polygon points="320,270 321.5,274.5 326,276 321.5,277.5 320,282 318.5,277.5 314,276 318.5,274.5" fill="#FDE047" />
      </g>
    ` : ''}

    <!-- SCALE & CENTER MAIN CHARACTER (base coord 240x240 mapped to 400x400) -->
    <g transform="translate(80, 50) scale(1)">
      <!-- 1. CLOUD BASE -->
      ${posture !== 'flying' ? `
        <g id="cloud-base">
          <ellipse cx="120" cy="205" rx="90" ry="28" fill="url(#cloudGrad)" />
          <circle cx="60" cy="198" r="34" fill="url(#cloudGrad)" />
          <circle cx="110" cy="190" r="38" fill="url(#cloudGrad)" />
          <circle cx="165" cy="194" r="36" fill="url(#cloudGrad)" />
          <circle cx="195" cy="205" r="24" fill="url(#cloudGrad)" />
          <ellipse cx="120" cy="210" rx="70" ry="14" fill="#CBD5E1" opacity="0.3" />
        </g>
      ` : `
        <g id="flying-trail">
          <path d="M0 195 Q 60 200, 120 185 Q 180 170, 240 190" stroke="#FDE047" stroke-width="3" stroke-dasharray="6 6" opacity="0.8" />
          <ellipse cx="100" cy="180" rx="65" ry="20" fill="url(#cloudGrad)" />
          <circle cx="55" cy="178" r="24" fill="url(#cloudGrad)" />
          <circle cx="135" cy="176" r="28" fill="url(#cloudGrad)" />
          <circle cx="35" cy="165" r="3" fill="#FDE047" />
          <circle cx="20" cy="190" r="2.5" fill="#FEF08A" />
          <circle cx="215" cy="160" r="3" fill="#FDE047" />
        </g>
      `}

      <!-- 2. PROPS: WORKBENCH (if working) -->
      ${posture === 'working' ? `
        <g id="drafting-desk">
          <rect x="40" y="178" width="160" height="28" rx="4" fill="#92400E" />
          <rect x="44" y="174" width="152" height="7" rx="2" fill="#B45309" />
          <rect x="70" y="170" width="65" height="20" rx="2" fill="#1E3A8A" stroke="#60A5FA" stroke-width="1.5" />
          <path d="M78 176 L 105 176 M78 182 L 120 182" stroke="#93C5FD" stroke-width="1.2" />
          <circle cx="115" cy="176" r="2.5" fill="#FDE047" />
          <rect x="145" y="173" width="35" height="6" rx="1" fill="#FBBF24" />
        </g>
      ` : ''}

      <!-- 3. BODY & PAJAMAS -->
      ${posture === 'sleeping' ? `
        <g id="body-sleeping">
          <ellipse cx="120" cy="165" rx="46" ry="34" fill="url(#pajamaGrad)" stroke="#E2E8F0" stroke-width="1" />
          <!-- Star pattern on pajamas -->
          <polygon points="105,155 106.5,158.5 110,159.5 106.5,160.5 105,164 103.5,160.5 100,159.5 103.5,158.5" fill="#FDE047" opacity="0.85" />
          <polygon points="125,165 126.5,168.5 130,169.5 126.5,170.5 125,174 123.5,170.5 120,169.5 123.5,168.5" fill="#FDE047" opacity="0.85" />
          <!-- Plush bunny companion -->
          <g id="plush-bunny" transform="translate(150, 150)">
            <ellipse cx="14" cy="18" rx="13" ry="15" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
            <ellipse cx="11" cy="5" rx="4" ry="9" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" transform="rotate(-15 11 5)" />
            <ellipse cx="19" cy="5" rx="4" ry="9" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" transform="rotate(10 19 5)" />
            <ellipse cx="11" cy="5" rx="2" ry="7" fill="#FCE7F3" transform="rotate(-15 11 5)" />
            <ellipse cx="19" cy="5" rx="2" ry="7" fill="#FCE7F3" transform="rotate(10 19 5)" />
            <path d="M9 16 Q 11 18, 13 16 M15 16 Q 17 18, 19 16" stroke="#94A3B8" stroke-width="1" fill="none" />
            <circle cx="14" cy="18" r="1.8" fill="#F472B6" />
          </g>
        </g>
      ` : `
        <g id="body-standard">
          <ellipse cx="120" cy="166" rx="42" ry="32" fill="url(#pajamaGrad)" stroke="#E2E8F0" stroke-width="1" />
          <!-- Gold stars on pajama -->
          <polygon points="120,152 121.5,155 125,156 121.5,157 120,160 118.5,157 115,156 118.5,155" fill="#FDE047" opacity="0.9" />
          <polygon points="120,168 121.5,171 125,172 121.5,173 120,176 118.5,173 115,172 118.5,171" fill="#FDE047" opacity="0.9" />
          <!-- Little pajama feet -->
          <ellipse cx="96" cy="188" rx="12" ry="9" fill="url(#pajamaGrad)" stroke="#E2E8F0" stroke-width="1" />
          <ellipse cx="144" cy="188" rx="12" ry="9" fill="url(#pajamaGrad)" stroke="#E2E8F0" stroke-width="1" />
          <ellipse cx="96" cy="189" rx="8" ry="5" fill="#FCE7F3" opacity="0.8" />
          <ellipse cx="144" cy="189" rx="8" ry="5" fill="#FCE7F3" opacity="0.8" />
        </g>
      `}

      <!-- 4. PIP'S RECOGNIZABLE SKULL HEAD -->
      <g id="head">
        <!-- Skull Head Base -->
        <path
          d="M 68 114
             C 68 74, 90 58, 120 58
             C 150 58, 172 74, 172 114
             C 172 138, 160 150, 148 150
             C 142 150, 138 146, 134 146
             C 126 146, 124 148, 120 148
             C 116 148, 114 146, 106 146
             C 102 146, 98 150, 92 150
             C 80 150, 68 138, 68 114 Z"
          fill="#FFFDF7"
          stroke="#EADBCE"
          stroke-width="2"
        />

        <!-- Inverted Heart Nose Cavity -->
        <path d="M 120 120 L 115 127 Q 120 129, 125 127 Z" fill="#3B2E3D" />

        <!-- Rosy Cheek Blush -->
        <circle cx="85" cy="127" r="8" fill="#F472B6" opacity="${emotion === 'shy' ? '0.85' : '0.5'}" />
        <circle cx="155" cy="127" r="8" fill="#F472B6" opacity="${emotion === 'shy' ? '0.85' : '0.5'}" />

        <!-- 5. EYES & EXPRESSIONS -->
        ${emotion === 'sleepy' || posture === 'sleeping' ? `
          <g id="eyes-sleepy">
            <path d="M 86 110 Q 98 122, 110 110" stroke="#D97706" stroke-width="4.5" stroke-linecap="round" fill="none" filter="url(#eyeGlow)" />
            <path d="M 130 110 Q 142 122, 154 110" stroke="#D97706" stroke-width="4.5" stroke-linecap="round" fill="none" filter="url(#eyeGlow)" />
            <path d="M 115 133 Q 120 137, 125 133" stroke="#4A3E4D" stroke-width="2" stroke-linecap="round" fill="none" />
          </g>
        ` : emotion === 'happy' ? `
          <g id="eyes-happy">
            <ellipse cx="98" cy="108" rx="14" ry="16" fill="#2E1C2B" />
            <ellipse cx="142" cy="108" rx="14" ry="16" fill="#2E1C2B" />
            <ellipse cx="98" cy="108" rx="11" ry="13" fill="#F59E0B" filter="url(#eyeGlow)" />
            <ellipse cx="142" cy="108" rx="11" ry="13" fill="#F59E0B" filter="url(#eyeGlow)" />
            <polygon points="98,99 100,105 106,107 100,109 98,115 96,109 90,107 96,105" fill="#FFFFFF" />
            <polygon points="142,99 144,105 150,107 144,109 142,115 140,109 134,107 140,105" fill="#FFFFFF" />
            <path d="M 112 131 Q 120 142, 128 131 Z" fill="#E11D48" stroke="#3B2E3D" stroke-width="1.2" />
          </g>
        ` : emotion === 'surprised' ? `
          <g id="eyes-surprised">
            <ellipse cx="98" cy="107" rx="16" ry="17" fill="#2E1C2B" />
            <ellipse cx="142" cy="107" rx="16" ry="17" fill="#2E1C2B" />
            <ellipse cx="98" cy="107" rx="13" ry="14" fill="#FBBF24" filter="url(#eyeGlow)" />
            <ellipse cx="142" cy="107" rx="13" ry="14" fill="#FBBF24" filter="url(#eyeGlow)" />
            <polygon points="98,98 101,104 107,107 101,110 98,116 95,110 89,107 95,104" fill="#FFFFFF" />
            <polygon points="142,98 145,104 151,107 145,110 142,116 139,110 133,107 139,104" fill="#FFFFFF" />
            <ellipse cx="120" cy="134" rx="5" ry="6.5" fill="#3B2E3D" />
          </g>
        ` : `
          <!-- Default Calm Glowing Amber Eyes -->
          <g id="eyes-default">
            <ellipse cx="98" cy="108" rx="14" ry="15" fill="#2E1C2B" />
            <ellipse cx="142" cy="108" rx="14" ry="15" fill="#2E1C2B" />
            <ellipse cx="98" cy="108" rx="11" ry="12" fill="#F59E0B" filter="url(#eyeGlow)" />
            <ellipse cx="142" cy="108" rx="11" ry="12" fill="#F59E0B" filter="url(#eyeGlow)" />
            <polygon points="98,101 100,106 105,108 100,110 98,115 96,110 91,108 96,106" fill="#FFFFFF" />
            <polygon points="142,101 144,106 149,108 144,110 142,115 140,110 135,108 140,106" fill="#FFFFFF" />
            <path d="M 115 132 Q 120 136, 125 132" stroke="#3B2E3D" stroke-width="2.2" stroke-linecap="round" fill="none" />
          </g>
        `}

        <!-- 6. PINK STARRY NIGHTCAP WITH BOW & POMPOM -->
        <g id="nightcap">
          <path
            d="M 64 88
               C 64 42, 100 20, 142 24
               C 178 28, 210 56, 215 92
               C 217 108, 198 114, 187 102
               C 178 90, 170 74, 152 70
               C 120 64, 80 70, 64 88 Z"
            fill="url(#hatGrad)"
          />
          <!-- Star pattern on cap -->
          <polygon points="105,40 107,43 110,44 107,45 105,48 103,45 100,44 103,43" fill="#FEF08A" />
          <polygon points="138,42 140,45 143,46 140,47 138,50 136,47 133,46 136,45" fill="#FEF08A" />
          <polygon points="172,60 173.5,62.5 176,63.5 173.5,64.5 172,67 170.5,64.5 168,63.5 170.5,62.5" fill="#FEF08A" />
          <polygon points="188,86 189.5,88.5 192,89.5 189.5,90.5 188,93 186.5,90.5 184,89.5 186.5,88.5" fill="#FEF08A" />
          <!-- Moon on cap -->
          <path d="M 122 34 A 6 6 0 0 0 128 44 A 5 5 0 0 1 122 34" fill="#FEF08A" />

          <!-- Fluffy Pompom -->
          <circle cx="208" cy="105" r="15" fill="#FFFFFF" stroke="#FCE7F3" stroke-width="1.5" />
          <circle cx="206" cy="103" r="11" fill="#FFFDF7" />

          <!-- Fluffy Cuff Band -->
          <path
            d="M 60 86
               C 60 70, 180 70, 180 86
               C 180 100, 60 100, 60 86 Z"
            fill="url(#cuffGrad)"
            stroke="#FBCFE8"
            stroke-width="1.8"
          />

          <!-- Pastel Pink Ribbon Bow -->
          <g id="ribbon-bow" transform="translate(152, 66)">
            <path d="M 0 0 C -14 -11, -16 11, 0 3 Z" fill="#F472B6" stroke="#DB2777" stroke-width="1.2" />
            <path d="M 0 0 C 14 -11, 16 11, 0 3 Z" fill="#F472B6" stroke="#DB2777" stroke-width="1.2" />
            <ellipse cx="0" cy="1.5" rx="4.5" ry="4.5" fill="#F9A8D4" stroke="#DB2777" stroke-width="1.2" />
            <path d="M -2 4 L -7 18 L -1 15 L 3 18 L 1 4" fill="#F472B6" />
          </g>
        </g>
      </g>

      <!-- 7. HANDS & FOREGROUND PROPS -->
      ${posture === 'holding-lantern' ? `
        <g id="holding-lantern-prop">
          <circle cx="100" cy="166" r="7.5" fill="#FFFDF7" stroke="#EADBCE" stroke-width="1.2" />
          <circle cx="140" cy="166" r="7.5" fill="#FFFDF7" stroke="#EADBCE" stroke-width="1.2" />
          <g id="brass-lantern" transform="translate(142, 140)">
            <circle cx="16" cy="30" r="34" fill="#F59E0B" opacity="0.35" filter="url(#lanternGlow)" />
            <path d="M 6 12 L 16 4 L 26 12 Z" fill="url(#brassGrad)" />
            <circle cx="16" cy="3" r="3" fill="#FBBF24" />
            <rect x="7" y="12" width="18" height="24" rx="2" fill="#FEF3C7" fill-opacity="0.9" stroke="#B45309" stroke-width="1.8" />
            <ellipse cx="16" cy="24" rx="4" ry="7" fill="#F59E0B" />
            <ellipse cx="16" cy="25" rx="2" ry="4" fill="#FEF08A" />
            <rect x="5" y="36" width="22" height="6" rx="2" fill="url(#brassGrad)" />
            <path d="M 10 4 A 6 6 0 0 1 22 4" stroke="#D97706" stroke-width="1.8" fill="none" />
          </g>
        </g>
      ` : posture === 'reading' ? `
        <g id="reading-book" transform="translate(80, 150)">
          <path d="M 0 18 Q 20 12, 40 18 Q 60 12, 80 18 L 76 38 Q 58 32, 40 35 Q 22 32, 4 38 Z" fill="#FDF8ED" stroke="#CA8A04" stroke-width="1.8" />
          <path d="M 40 18 L 40 35" stroke="#D97706" stroke-width="1.8" />
          <circle cx="20" cy="25" r="2" fill="#93C5FD" />
          <circle cx="60" cy="25" r="2" fill="#FBBF24" />
          <circle cx="14" cy="30" r="7" fill="#FFFDF7" stroke="#EADBCE" stroke-width="1.2" />
          <circle cx="66" cy="30" r="7" fill="#FFFDF7" stroke="#EADBCE" stroke-width="1.2" />
        </g>
      ` : posture === 'sleeping' ? '' : `
        <!-- Standard: Holding Glowing Smiling Star -->
        <g id="holding-star">
          <g id="smiling-star" transform="translate(100, 144)">
            <circle cx="20" cy="20" r="26" fill="#FEF08A" opacity="0.4" />
            <polygon
              points="20,2 25,14 38,15 28,24 31,37 20,30 9,37 12,24 2,15 15,14"
              fill="url(#starGrad)"
              stroke="#D97706"
              stroke-width="1.8"
            />
            <circle cx="16" cy="20" r="2" fill="#78350F" />
            <circle cx="24" cy="20" r="2" fill="#78350F" />
            <circle cx="13" cy="22" r="2.5" fill="#F472B6" opacity="0.75" />
            <circle cx="27" cy="22" r="2.5" fill="#F472B6" opacity="0.75" />
            <path d="M 18 24 Q 20 27, 22 24" stroke="#78350F" stroke-width="1.4" stroke-linecap="round" fill="none" />
          </g>
          <circle cx="102" cy="168" r="7" fill="#FFFDF7" stroke="#EADBCE" stroke-width="1.2" />
          <circle cx="138" cy="168" r="7" fill="#FFFDF7" stroke="#EADBCE" stroke-width="1.2" />
        </g>
      `}

      <!-- 8. EMOTIONAL OVERLAYS -->
      ${emotion === 'curious' ? `
        <text x="175" y="65" fill="#A855F7" font-size="28" font-weight="bold" font-family="sans-serif">?</text>
      ` : emotion === 'excited' ? `
        <text x="175" y="65" fill="#FBBF24" font-size="28" font-weight="bold" font-family="sans-serif">!!</text>
      ` : emotion === 'shy' ? `
        <text x="172" y="65" fill="#EC4899" font-size="22" font-family="sans-serif">♥</text>
      ` : ''}
    </g>
  </svg>`;
}

const STATES = [
  { state: 'idle', label: 'Idle', posture: 'sitting', emotion: 'default', row: 0, col: 0, desc: 'Pip sitting on cloud holding a star, gentle smile' },
  { state: 'happy', label: 'Happy', posture: 'sitting', emotion: 'happy', row: 0, col: 1, desc: 'Pip cheering with joyful sparkle eyes and smiling star' },
  { state: 'curious', label: 'Curious', posture: 'sitting', emotion: 'curious', row: 0, col: 2, desc: 'Pip tilting head inquisitively with question mark' },
  { state: 'excited', label: 'Excited', posture: 'sitting', emotion: 'excited', row: 0, col: 3, desc: 'Pip jumping with glee, cheerful grin and stars' },
  { state: 'sleepy', label: 'Sleepy', posture: 'sitting', emotion: 'sleepy', row: 1, col: 0, desc: 'Pip yawning with soft drooping eyes' },
  { state: 'surprised', label: 'Surprised', posture: 'sitting', emotion: 'surprised', row: 1, col: 1, desc: 'Pip with wide starry eyes and open mouth' },
  { state: 'shy', label: 'Shy', posture: 'sitting', emotion: 'shy', row: 1, col: 2, desc: 'Pip blushing with rosy pink cheeks and hearts' },
  { state: 'reading', label: 'Reading', posture: 'reading', emotion: 'default', row: 1, col: 3, desc: 'Pip reading a bedtime storybook' },
  { state: 'working', label: 'Working', posture: 'working', emotion: 'default', row: 2, col: 0, desc: 'Pip at the dream blueprints drafting desk' },
  { state: 'flying', label: 'Flying', posture: 'flying', emotion: 'happy', row: 2, col: 1, desc: 'Pip swooping through clouds with stardust trail' },
  { state: 'holding-lantern', label: 'Holding Lantern', posture: 'holding-lantern', emotion: 'excited', row: 2, col: 2, desc: 'Pip holding glowing golden starlight lantern' },
  { state: 'sleeping', label: 'Sleeping', posture: 'sleeping', emotion: 'sleepy', row: 2, col: 3, desc: 'Pip curled up asleep on a cloud with bunny plush' },
];

async function generateAll() {
  console.log('Generating Pip assets with Sharp...');

  // 1. Official Avatar (full scene with cream background, cloud, moon, and surrounding stars)
  const avatarSvg = getSvg('sitting', 'default', {
    background: true,
    showMoon: true,
    showSurroundingStars: true,
  });

  const avatarDest1 = path.join(PUBLIC_ASSETS, 'pip-avatar-cloud.png');
  const avatarDest2 = path.join(PIP_DIR, 'pip-avatar.png');
  const avatarDest3 = path.join(PIP_DIR, 'pip-avatar.jpg');

  await sharp(Buffer.from(avatarSvg)).png().toFile(avatarDest1);
  await sharp(Buffer.from(avatarSvg)).png().toFile(avatarDest2);
  await sharp(Buffer.from(avatarSvg)).jpeg({ quality: 95 }).toFile(avatarDest3);
  console.log(`✓ Generated official avatar: ${avatarDest1}`);

  // 2. All 12 expressions
  const manifest = {
    updatedAt: new Date().toISOString(),
    officialAvatar: {
      sourceFile: 'pip-avatar-cloud.png',
      assetPath: '/assets/pip-avatar-cloud.png',
      status: 'ready',
    },
    totalStates: STATES.length,
    extractedStates: [],
    pendingStates: [],
    notes: ['Official character avatar and 12 vector-rendered individual expression assets generated with high-DPI fidelity.'],
  };

  for (const s of STATES) {
    const exprSvg = getSvg(s.posture, s.emotion, { background: false });
    const exprPath = path.join(EXPRESSIONS_DIR, `${s.state}.png`);
    await sharp(Buffer.from(exprSvg)).png().toFile(exprPath);
    console.log(`✓ Generated expression: ${s.state} -> ${exprPath}`);

    manifest.extractedStates.push({
      state: s.state,
      label: s.label,
      description: s.desc,
      gridPosition: { row: s.row, col: s.col },
      assetPath: `/assets/pip/expressions/${s.state}.png`,
      status: 'ready',
    });
  }

  // 3. Save manifest
  const manifestPath = path.join(PIP_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`✓ Generated manifest at ${manifestPath}`);
  console.log('All Pip assets ready!');
}

generateAll().catch(console.error);

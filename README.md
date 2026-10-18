# Pip's Dream Studio ☁️✨

An interactive character engine and cozy bedtime operating system built for the **hax.baby hackathon** by **Team Expo**.

- **Repository**: [soumyajitguria005-art/hax.baby-hackathon](https://github.com/soumyajitguria005-art/hax.baby-hackathon)
- **Live Deployed App**:[ [npx plugins add vercel/vercel-plugin](npx plugins add vercel/vercel-plugin)](https://hax-baby-hackathon.vercel.app/)

---

## 📖 Why We Built Pip's Dream Studio

Modern screens often keep us awake with endless feeds and bright notifications. For the hax.baby hackathon, we wanted to build the opposite: a warm, tactile digital bedtime world where technology slows down and helps you rest.

We designed **Pip**, a sleepy Junior Dream Engineer at the Midnight Nursery. Pip's job is simple: curate comforting dreamscapes, tune soft celesta lullabies, and light bedroom pathways with a tiny golden lantern so bedtime feels peaceful and magical again.

---

## 🌟 What You Can Do in the Nursery

### 1. The Opening Wake-Up Experience
- When you first arrive at the Midnight Nursery, Pip is fast asleep on a cloud.
- Press and hold (or tap) the glowing star to gently wake Pip.
- Pip rubs his eyes, presents his official dream engineer credentials, and welcomes you into the Dream OS.
- Your session is remembered in `sessionStorage` so refreshing doesn't lock you out, but you can replay the introduction anytime by clicking the brand star in the top navbar.

### 2. Pip Character Engine & Interactive Playground
- **12 Distinct Character States**: Pip switches between `idle`, `happy`, `curious`, `excited`, `sleepy`, `surprised`, `shy`, `reading`, `working`, `flying`, `holding-lantern`, and `sleeping`.
- **Character Studio**: Test all 12 states live in the studio matrix with spring button bounces and state-specific audio chimes.
- **Physics Head-Tilt**: Pip responds to mouse and pointer positions, tilting his head with curious amber eyes.
- **Inactivity Detection**: If left idle for more than 12 seconds, Pip automatically yawns and curls up to sleep until you move your mouse or click.

### 3. Three Interactive Showcase Projects
Each project card features 3D perspective tilt, live 3D models rendered with Three.js, a 3D card flip to inspect design concepts, and an interactive modal mini-window:
- **Cloudcastle Dreamscape**:
  - Orbiting Three.js 3D cloud citadel with live celestial flight trajectory simulation.
  - Dual view modes: toggle seamlessly between 3D WebGL orbit and a 2D SVG vector waypoint map.
  - Click the card or tap **Details** to open the technical specs window (`Esc` or backdrop click to close).
- **Moonbeam Lullabies**:
  - Interactive 3D celestial music box with rotating gears and floating note particles.
  - Custom Web Audio API synthesizer tuned to 432Hz pentatonic frequencies with an 8-band real-time visualizer.
  - Full audio envelope controls and non-disruptive global mute synchronization.
- **The Little Lantern Tales**:
  - High-fidelity 3D brass lantern rendered with physical materials (PBR) and dynamic Three.js `PointLight`.
  - Story ambiance temperature presets (Amber, Moonlight, Rose, Mint) and live luminance radius sliders.
  - Bedtime story narrative flip card with garden path chronicles.

### 4. Interactive Bedtime Chronicles & Delivery Logistics
- **Origin Story**: 3 illustrated timeline chapters following Pip and the fallen star. Navigate through chapters with timeline badges or step controls.
- **Dream Delivery Routes**: Interactive waypoint route dispatcher where you choose a nighttime recipient (Sleepy Forest Bear, Little Cloud Rabbit, Moonlit Stargazer Owl) and launch an animated star comet delivery along a glowing SVG path.

### 5. Community Starlight Guestbook
- Leave a dream wish or kind note on the nursery board.
- Client-side validation: 2–32 characters for names, 3–280 characters for messages, with real-time character counters.
- Safe Unicode text sanitization that strips control characters without corrupting apostrophes or ampersands.
- Dual-mode persistence: connects to Supabase PostgreSQL when credentials exist, and falls back to persistent browser storage with honest status badges when offline.

### 6. Atomic Visitor Counter
- Live session counter in the footer that tracks unique visits without inflating counts on page refreshes.
- Calls an atomic PostgreSQL RPC function (`increment_visitor_counter`) when Supabase is connected.
- Protected against React Strict Mode and concurrent mount race conditions via in-memory execution locking.
- Genuinely starts at 1 for local sessions (no fake or hardcoded numbers).

### 7. Responsive Chaos Mode (Easter Egg Bonus)
- Toggle the retro arcade Chaos Mode from the top navbar.
- Spawns restrained retro floating dream sprites, celebratory confetti bursts, and playful click sparkle audio.
- Automatically respects OS `prefers-reduced-motion` settings.
- Dismiss anytime via the top marquee banner or navbar toggle with full cleanup.

### 8. Liquid Glass UI & Atmosphere
- **Theme Switcher**: Day mode (warm cream `#fff8f1`) and Night mode (deep plum `#251a2a`) with smooth CSS variable transitions.
- **Custom Ghost Cursor**: Trailing stardust companion that tilts with velocity, blinks when idle, and squashes on click. Automatically disables on touchscreens or reduced-motion environments, and restores the standard cursor over inputs, navbar links, and buttons.
- **Easter Egg**: Click the little brand star in the navbar 4 times to unlock a secret constellation celebration.

---

## 🛠️ Architecture & Tech Stack

| Layer | Tools & Libraries |
|---|---|
| **Framework** | React 19 SPA, TypeScript, Vite |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`), custom liquid glass blur & border glows |
| **3D Rendering** | Three.js (`@types/three`) with custom procedural geometry & PBR shaders |
| **Sound System** | Custom Web Audio API Oscillator & Gain synthesizer |
| **Animation** | Motion (`motion`), Canvas Confetti (`canvas-confetti`) |
| **Data & Persistence** | Supabase (`@supabase/supabase-js`, PostgreSQL with RLS & RPC) |
| **Icons & Typography** | Lucide React, Google Fonts (`DM Serif Display`, `Fredoka`, `Nunito`) |

---

## 🚀 Running Locally

### Prerequisites
- Node.js 20+ or 22+
- npm 10+

### Step-by-Step Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/soumyajitguria005-art/hax.baby-hackathon.git
   cd hax.baby-hackathon
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional):**
   ```bash
   cp .env.example .env
   ```
   If connecting to a shared Supabase database, set:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
   *Note: If these variables are left blank, the app runs in Local Demo Mode automatically with zero crashes.*

4. **Database Migration (If using Supabase):**
   Execute the migration SQL file in your Supabase SQL Editor:
   `supabase/migrations/20261018000000_create_guestbook_and_counter.sql`
   This sets up the `guestbook_entries` and `visitor_counter` tables, Row Level Security policies, and the `increment_visitor_counter()` RPC function.

5. **Start development server:**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` in your browser.

6. **Verify build and types:**
   ```bash
   npm run lint   # Runs tsc --noEmit
   npm run build  # Builds production bundle
   ```

---

## 👥 Team Expo

Built with care for the hax.baby hackathon by **Team Expo**:

- **Soumyajit Guria** — Lead Architect & Fullstack
  - [GitHub](https://github.com/soumyajitguria005-art)
  - [LinkedIn](https://www.linkedin.com/in/soumyajit005/)
  - [Instagram](https://www.instagram.com/soumya_jit.exe?stkn=MW9zNnR5NW5qMnh3Ng==)
- **Shubhankar Das** — Creative Technologist
  - [GitHub](https://github.com/shubhankarO5)
  - [LinkedIn](https://www.linkedin.com/in/shubhankar05/)
  - [Instagram](https://www.instagram.com/shubhankar.d_5?stkn=eGNnd3E5NW13Znk2)
- **Shubham Si** — Frontend & Interactions
  - [GitHub](https://github.com/shubham07sipm-netizen)
  - [Instagram](https://www.instagram.com/shubham_12.s?stkn=ZHZpa3V0emNtaGs=)
  - *(LinkedIn profile URL pending developer verification)*

---

## 📄 License

MIT © 2026 Team Expo. Built with liquid glass and stardust.

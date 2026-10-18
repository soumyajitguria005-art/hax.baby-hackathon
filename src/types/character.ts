export type PipState =
  | 'idle'
  | 'happy'
  | 'curious'
  | 'excited'
  | 'sleepy'
  | 'surprised'
  | 'shy'
  | 'reading'
  | 'working'
  | 'flying'
  | 'holding-lantern'
  | 'sleeping';

export type PipPosture =
  | 'sitting'
  | 'lying-cloud'
  | 'reading'
  | 'working'
  | 'flying'
  | 'holding-lantern'
  | 'with-music-box'
  | 'peeking'
  | 'sleeping';

export type PipEmotion =
  | 'default'
  | 'happy'
  | 'curious'
  | 'excited'
  | 'sleepy'
  | 'surprised'
  | 'shy'
  | 'thinking'
  | 'wink'
  | 'sad';

export interface PipStateConfig {
  name: PipState;
  label: string;
  posture: PipPosture;
  emotion: PipEmotion;
  description: string;
  speech: string;
  hasParticles?: 'notes' | 'stars' | 'zzz' | 'question' | 'exclamation' | 'glow';
  accentColor: string;
}

export interface PipCharacterProps {
  state: PipState;
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  enableTilt?: boolean;
  ambientGlow?: boolean;
  theme?: 'day' | 'night';
  showSpeechBubble?: boolean;
  speechText?: string;
  showParticles?: boolean;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
  onStateChange?: (state: PipState) => void;
  role?: string;
  ariaLabel?: string;
}

export interface GuestbookEntry {
  id: string;
  authorName: string;
  message: string;
  createdAt: string;
  avatarEmoji: string;
  isLocal?: boolean;
}

export interface GuestbookResponse {
  entries: GuestbookEntry[];
  isShared: boolean;
  message?: string;
}

const STORAGE_KEY = 'pip_dream_guestbook_entries';

const STARTER_ENTRIES: GuestbookEntry[] = [
  {
    id: 'starter-1',
    authorName: 'Luna & the Nightingales',
    message: 'The Cloudcastle Dreamscape is pure magic. Truly feels like floating above cotton candy clouds! 🏰☁️',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    avatarEmoji: '🌙',
    isLocal: false,
  },
  {
    id: 'starter-2',
    authorName: 'Barnaby Bear',
    message: 'Pip, the Moonbeam Lullabies helped my little cub fall right asleep tonight. Thank you, Dream Engineer! 🧸✨',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    avatarEmoji: '⭐',
    isLocal: false,
  },
  {
    id: 'starter-3',
    authorName: 'A Cozy Dreamer',
    message: 'Followed the Little Lantern Tale all the way to dreamland. The stars shine brighter here! 🏮💛',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    avatarEmoji: '✨',
    isLocal: false,
  },
];

const EMOJI_OPTIONS = ['⭐', '🌙', '☁️', '🏮', '✨', '🎈', '🪄', '🧸', '🧁', '🌸'];

export function sanitizeText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
}

export async function fetchGuestbookEntries(): Promise<GuestbookResponse> {
  // 1. Check if a live backend route is reachable
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch('/api/guestbook', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.entries)) {
        return {
          entries: data.entries,
          isShared: true,
          message: 'Connected to live shared backend.',
        };
      }
    }
  } catch {
    // Backend API not reachable or not configured
  }

  // 2. Fallback to browser persistent storage with honest reporting
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return {
            entries: parsed,
            isShared: false,
            message: 'Shared database backend not configured. Operating in persistent local browser demo mode.',
          };
        }
      }
      // Initialize with starters if nothing saved yet
      localStorage.setItem(STORAGE_KEY, JSON.stringify(STARTER_ENTRIES));
      return {
        entries: STARTER_ENTRIES,
        isShared: false,
        message: 'Shared database backend not configured. Operating in persistent local browser demo mode.',
      };
    } catch {
      // localStorage unavailable
    }
  }

  return {
    entries: STARTER_ENTRIES,
    isShared: false,
    message: 'Operating in memory demo mode.',
  };
}

export async function submitGuestbookEntry(
  authorName: string,
  message: string
): Promise<{ success: boolean; entry?: GuestbookEntry; error?: string; isShared: boolean }> {
  const trimmedName = authorName.trim();
  const trimmedMessage = message.trim();

  // Strict Validation
  if (!trimmedName || trimmedName.length < 2) {
    return { success: false, error: 'Name must be at least 2 characters long.', isShared: false };
  }
  if (trimmedName.length > 32) {
    return { success: false, error: 'Name must not exceed 32 characters.', isShared: false };
  }
  if (!trimmedMessage || trimmedMessage.length < 3) {
    return { success: false, error: 'Please enter a message (at least 3 characters).', isShared: false };
  }
  if (trimmedMessage.length > 280) {
    return { success: false, error: 'Message must not exceed 280 characters.', isShared: false };
  }

  const cleanName = sanitizeText(trimmedName);
  const cleanMessage = sanitizeText(trimmedMessage);
  const randomEmoji = EMOJI_OPTIONS[Math.floor(Math.random() * EMOJI_OPTIONS.length)];

  // Attempt backend POST
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch('/api/guestbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorName: cleanName, message: cleanMessage, avatarEmoji: randomEmoji }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.entry) {
        return { success: true, entry: data.entry, isShared: true };
      }
    }
  } catch {
    // Backend API not reachable
  }

  // Local storage submission
  const newEntry: GuestbookEntry = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    authorName: cleanName,
    message: cleanMessage,
    createdAt: new Date().toISOString(),
    avatarEmoji: randomEmoji,
    isLocal: true,
  };

  try {
    const current = await fetchGuestbookEntries();
    const updated = [newEntry, ...current.entries];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return { success: true, entry: newEntry, isShared: false };
  } catch {
    return { success: false, error: 'Could not save entry to local storage.', isShared: false };
  }
}

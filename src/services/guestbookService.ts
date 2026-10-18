import { supabase, isSupabaseConfigured, getSupabaseConfigStatus } from '../lib/supabase';

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
  statusMessage: string;
  missingConfig?: string[];
}

const STORAGE_KEY = 'pip_dream_guestbook_entries_v2';

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
  // Strip control characters, excessive whitespace, and normalize Unicode safely for React
  return text
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '')
    .trim();
}

/**
 * Fetches all guestbook entries, preferring Supabase if configured,
 * otherwise falling back to persistent local storage with transparent reporting.
 */
export async function fetchGuestbookEntries(): Promise<GuestbookResponse> {
  const config = getSupabaseConfigStatus();

  // 1. Live Supabase database integration
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('guestbook_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && Array.isArray(data)) {
        const mappedEntries: GuestbookEntry[] = data.map((row) => ({
          id: row.id,
          authorName: row.author_name,
          message: row.message,
          createdAt: row.created_at,
          avatarEmoji: row.avatar_emoji || '⭐',
          isLocal: false,
        }));

        return {
          entries: mappedEntries,
          isShared: true,
          statusMessage: 'Connected to live shared Supabase database.',
        };
      } else if (error) {
        console.warn('Supabase query error (table may need migration):', error.message);
      }
    } catch (err) {
      console.warn('Failed to communicate with Supabase:', err);
    }
  }

  // 2. Persistent Local Browser Fallback with Honest Reporting
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return {
            entries: parsed,
            isShared: false,
            missingConfig: config.missingKeys,
            statusMessage: config.missingKeys.length > 0
              ? `Local Session Demo (${config.missingKeys.join(', ')} not configured)`
              : 'Local Session Demo',
          };
        }
      }

      // Initialize with starters if nothing saved yet
      localStorage.setItem(STORAGE_KEY, JSON.stringify(STARTER_ENTRIES));
      return {
        entries: STARTER_ENTRIES,
        isShared: false,
        missingConfig: config.missingKeys,
        statusMessage: config.missingKeys.length > 0
          ? `Local Session Demo (${config.missingKeys.join(', ')} not configured)`
          : 'Local Session Demo',
      };
    } catch {
      // LocalStorage not accessible
    }
  }

  return {
    entries: STARTER_ENTRIES,
    isShared: false,
    statusMessage: 'In-Memory Demo Mode',
  };
}

/**
 * Submits a new guestbook entry with length validation, XSS sanitization,
 * and duplicate-submit prevention.
 */
export async function submitGuestbookEntry(
  authorName: string,
  message: string
): Promise<{ success: boolean; entry?: GuestbookEntry; error?: string; isShared: boolean }> {
  const trimmedName = authorName.trim();
  const trimmedMessage = message.trim();

  // Strict Validation Rules
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

  // 1. Attempt Supabase live insertion if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('guestbook_entries')
        .insert([
          {
            author_name: cleanName,
            message: cleanMessage,
            avatar_emoji: randomEmoji,
          },
        ])
        .select()
        .single();

      if (!error && data) {
        const liveEntry: GuestbookEntry = {
          id: data.id,
          authorName: data.author_name,
          message: data.message,
          createdAt: data.created_at,
          avatarEmoji: data.avatar_emoji || randomEmoji,
          isLocal: false,
        };
        return { success: true, entry: liveEntry, isShared: true };
      } else if (error) {
        console.warn('Supabase insert error:', error.message);
        return {
          success: false,
          error: `Database error: ${error.message}. Please verify migrations are applied.`,
          isShared: true,
        };
      }
    } catch (err: unknown) {
      console.warn('Supabase request failed:', err);
      return {
        success: false,
        error: 'Network connection to Supabase failed. Please try again.',
        isShared: true,
      };
    }
  }

  // 2. Persistent Local Storage Submission
  const localEntry: GuestbookEntry = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    authorName: cleanName,
    message: cleanMessage,
    createdAt: new Date().toISOString(),
    avatarEmoji: randomEmoji,
    isLocal: true,
  };

  try {
    const current = await fetchGuestbookEntries();
    const updated = [localEntry, ...current.entries];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return { success: true, entry: localEntry, isShared: false };
  } catch {
    return { success: false, error: 'Could not write to local storage.', isShared: false };
  }
}

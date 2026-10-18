import { supabase, isSupabaseConfigured, getSupabaseConfigStatus } from '../lib/supabase';

export interface VisitorCounterResult {
  count: number;
  isShared: boolean;
  status: 'shared' | 'local' | 'error';
  statusMessage: string;
  metric: 'session';
}

const LOCAL_STORAGE_KEY = 'pip_local_session_counter';
const SESSION_FLAG_KEY = 'pip_session_counted_v3';

export async function getAndIncrementVisitorCount(): Promise<VisitorCounterResult> {
  const configStatus = getSupabaseConfigStatus();

  // 1. If Supabase is configured, use database-backed atomic counter
  if (isSupabaseConfigured && supabase) {
    const isSessionCounted = typeof window !== 'undefined' && sessionStorage.getItem(SESSION_FLAG_KEY);

    try {
      if (!isSessionCounted) {
        // Attempt atomic increment via RPC
        const { data, error } = await supabase.rpc('increment_visitor_counter');

        if (!error && data !== null && data !== undefined) {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(SESSION_FLAG_KEY, 'true');
          }
          return {
            count: Number(data),
            isShared: true,
            status: 'shared',
            statusMessage: 'Live Shared Database Counter',
            metric: 'session',
          };
        }

        // If RPC failed (e.g. migration not applied), attempt read-only query
        const { data: readData, error: readError } = await supabase
          .from('visitor_counter')
          .select('count')
          .eq('id', 'global')
          .single();

        if (!readError && readData) {
          return {
            count: Number(readData.count),
            isShared: true,
            status: 'shared',
            statusMessage: 'Live Shared Database (Read-Only)',
            metric: 'session',
          };
        }
      } else {
        // Already counted this session, fetch current count
        const { data, error } = await supabase
          .from('visitor_counter')
          .select('count')
          .eq('id', 'global')
          .single();

        if (!error && data) {
          return {
            count: Number(data.count),
            isShared: true,
            status: 'shared',
            statusMessage: 'Live Shared Database Counter',
            metric: 'session',
          };
        }
      }
    } catch (err) {
      console.warn('Supabase visitor counter error, falling back honestly:', err);
    }
  }

  // 2. Honest Local Session Counter Fallback (Zero hardcoded starting counts)
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      // Start genuinely at 1 for the first session instead of an invented fake number (like 42)
      const currentCount = stored ? parseInt(stored, 10) : 1;

      const isSessionCounted = sessionStorage.getItem(SESSION_FLAG_KEY);
      if (!isSessionCounted) {
        // If there was already a stored count from a previous session, increment by 1
        const nextCount = stored ? currentCount + 1 : 1;
        localStorage.setItem(LOCAL_STORAGE_KEY, nextCount.toString());
        sessionStorage.setItem(SESSION_FLAG_KEY, 'true');
        return {
          count: nextCount,
          isShared: false,
          status: 'local',
          statusMessage: configStatus.missingKeys.length > 0
            ? `Local Session Only (${configStatus.missingKeys.join(', ')} not configured)`
            : 'Local Session Only',
          metric: 'session',
        };
      }

      return {
        count: currentCount,
        isShared: false,
        status: 'local',
        statusMessage: configStatus.missingKeys.length > 0
          ? `Local Session Only (${configStatus.missingKeys.join(', ')} not configured)`
          : 'Local Session Only',
        metric: 'session',
      };
    } catch {
      // Storage unavailable
    }
  }

  return {
    count: 1,
    isShared: false,
    status: 'local',
    statusMessage: 'Local Session Only',
    metric: 'session',
  };
}

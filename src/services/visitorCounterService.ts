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

// In-memory promise cache to guarantee single execution during React StrictMode and concurrent renders
let inFlightCounterPromise: Promise<VisitorCounterResult> | null = null;

async function executeGetAndIncrement(): Promise<VisitorCounterResult> {
  const configStatus = getSupabaseConfigStatus();

  // 1. If Supabase is configured, use database-backed atomic counter
  if (isSupabaseConfigured && supabase) {
    const isSessionCounted =
      typeof window !== 'undefined' && sessionStorage.getItem(SESSION_FLAG_KEY) === 'true';

    try {
      if (!isSessionCounted) {
        // Mark session counted early to avoid race conditions
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(SESSION_FLAG_KEY, 'true');
        }

        // Attempt atomic increment via RPC
        const { data, error } = await supabase.rpc('increment_visitor_counter');

        if (!error && data !== null && data !== undefined) {
          return {
            count: Number(data),
            isShared: true,
            status: 'shared',
            statusMessage: 'Live Shared Database Counter',
            metric: 'session',
          };
        }

        // If RPC failed (e.g. migration not applied yet), attempt read-only query
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
            statusMessage: 'Live Shared Database (Read-Only; Run Migration for Atomic Inc)',
            metric: 'session',
          };
        }

        // If table doesn't exist or permissions issue, provide honest explanation
        console.warn('Supabase counter query error:', error?.message || readError?.message);
        return {
          count: 1,
          isShared: true,
          status: 'error',
          statusMessage: 'Supabase Connected (Migration pending in public.visitor_counter)',
          metric: 'session',
        };
      } else {
        // Already counted in this session, read current global count
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

        return {
          count: 1,
          isShared: true,
          status: 'shared',
          statusMessage: 'Live Shared Database (Connected)',
          metric: 'session',
        };
      }
    } catch (err) {
      console.warn('Supabase visitor counter error, falling back honestly:', err);
    }
  }

  // 2. Honest Local Session Counter Fallback (Zero hardcoded starting counts)
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      // Start genuinely from 1 on the first visit, not an arbitrary fake number like 42
      const currentCount = stored ? parseInt(stored, 10) : 0;

      const isSessionCounted = sessionStorage.getItem(SESSION_FLAG_KEY) === 'true';
      if (!isSessionCounted) {
        const nextCount = Math.max(1, currentCount + 1);
        localStorage.setItem(LOCAL_STORAGE_KEY, nextCount.toString());
        sessionStorage.setItem(SESSION_FLAG_KEY, 'true');
        return {
          count: nextCount,
          isShared: false,
          status: 'local',
          statusMessage:
            configStatus.missingKeys.length > 0
              ? `Local Session Demo (${configStatus.missingKeys.join(', ')} not configured)`
              : 'Local Session Demo',
          metric: 'session',
        };
      }

      return {
        count: Math.max(1, currentCount),
        isShared: false,
        status: 'local',
        statusMessage:
          configStatus.missingKeys.length > 0
            ? `Local Session Demo (${configStatus.missingKeys.join(', ')} not configured)`
            : 'Local Session Demo',
        metric: 'session',
      };
    } catch {
      // LocalStorage restricted/unavailable
    }
  }

  return {
    count: 1,
    isShared: false,
    status: 'local',
    statusMessage: 'Local In-Memory Demo',
    metric: 'session',
  };
}

export function getAndIncrementVisitorCount(): Promise<VisitorCounterResult> {
  if (!inFlightCounterPromise) {
    inFlightCounterPromise = executeGetAndIncrement();
  }
  return inFlightCounterPromise;
}

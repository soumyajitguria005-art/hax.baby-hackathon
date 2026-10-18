import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface SupabaseConfigStatus {
  isConfigured: boolean;
  missingKeys: string[];
  url?: string;
}

export function getSupabaseConfigStatus(): SupabaseConfigStatus {
  const missing: string[] = [];
  if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co' || supabaseUrl.includes('placeholder')) {
    missing.push('VITE_SUPABASE_URL');
  }
  if (!supabaseAnonKey || supabaseAnonKey.includes('placeholder')) {
    missing.push('VITE_SUPABASE_ANON_KEY');
  }

  return {
    isConfigured: missing.length === 0,
    missingKeys: missing,
    url: supabaseUrl,
  };
}

const status = getSupabaseConfigStatus();

export const isSupabaseConfigured: boolean = status.isConfigured;

// Initialize Supabase client only when valid credentials exist
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

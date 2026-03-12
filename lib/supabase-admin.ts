import { createClient } from '@supabase/supabase-js';

// Admin client for server-side only operations
// Lazy initialization to avoid build-time errors
let _supabaseAdmin: ReturnType<typeof createClient> | null = null;

export function getSupabaseAdmin() {
  if (_supabaseAdmin) return _supabaseAdmin;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('CRITICAL: Supabase Admin environment variables are missing!');
    throw new Error('Supabase Admin client could not be initialized (Missing URL or Key)');
  }
  
  _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  
  return _supabaseAdmin;
}

// Backward-compatible export - lazy proxy
export const supabaseAdmin = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    const client = getSupabaseAdmin();
    return (client as Record<string | symbol, unknown>)[prop];
  }
});

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Admin client for server-side only operations
// We initialize it lazily or safely
const createAdminClient = () => {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('CRITICAL: Supabase Admin environment variables are missing!');
    throw new Error('Supabase Admin client could not be initialized (Missing URL or Key)');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

export const supabaseAdmin = createAdminClient();

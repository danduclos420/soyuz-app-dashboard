import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkRealm() {
  const { data: configData } = await supabase
    .from('app_config')
    .select('*')
    .eq('key', 'quickbooks_token')
    .single();

  const token = configData.value;
  console.log('Token Realm ID in Supabase:', token.realmId);
  // realmId is usually also returned in the initial exchange but we store it
}

checkRealm();

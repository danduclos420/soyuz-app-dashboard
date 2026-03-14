import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkToken() {
  console.log('Checking QuickBooks token in Supabase...');
  const { data, error } = await supabase
    .from('app_config')
    .select('*')
    .eq('key', 'quickbooks_token')
    .maybeSingle();

  if (error) {
    console.error('Error fetching token:', error);
    return;
  }

  if (data) {
    console.log('Token found!');
    console.log('Updated at:', data.updated_at);
    const token = data.value;
    const expiresAt = new Date(token.expires_at);
    console.log('Expires at:', expiresAt.toLocaleString());
    console.log('Current time:', new Date().toLocaleString());
    
    if (Date.now() > token.expires_at) {
      console.log('Token is EXPIRED. Needs refresh.');
    } else {
      console.log('Token is still VALID.');
    }
  } else {
    console.log('No QuickBooks token found in app_config table.');
  }
}

checkToken();

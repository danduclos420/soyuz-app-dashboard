import { getSupabaseAdmin } from '../lib/supabase-admin';
import { refreshQBToken, QB_CONFIG } from '../lib/quickbooks';

async function listAccounts() {
  const supabase = getSupabaseAdmin();
  const { data: configData } = await (supabase.from('app_config') as any)
    .select('value')
    .eq('key', 'quickbooks_token')
    .single();

  if (!configData) throw new Error('No QB token');
  let token = configData.value;
  
  if (Date.now() >= token.expires_at) {
    token = await refreshQBToken(token.refresh_token);
  }

  const query = "SELECT * FROM Account";
  const url = `${QB_CONFIG.apiUri}/${token.realmId}/query?query=${encodeURIComponent(query)}&minorversion=65`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token.access_token}`,
      'Accept': 'application/json'
    }
  });

  const data = await response.json();
  const accounts = data.QueryResponse.Account || [];
  
  console.log('Accounts found:');
  accounts.forEach((acc: any) => {
    console.log(`- ${acc.Name} (ID: ${acc.Id}, Type: ${acc.AccountType})`);
  });
}

listAccounts();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSandbox() {
  const { data: configData } = await supabase
    .from('app_config')
    .select('value')
    .eq('key', 'quickbooks_token')
    .single();

  const token = configData.value;
  const realmId = token.realmId;
  const accessToken = token.access_token;

  console.log(`Checking Sandbox Info for Realm: ${realmId}`);
  
  const url = `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/companyinfo/${realmId}?minorversion=65`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    console.error('Sandbox Error:', response.status, response.statusText);
    console.error('Body:', await response.text());
  } else {
    const data = await response.json();
    console.log('SUCCESS! Company Name (Sandbox):', data.CompanyInfo.CompanyName);
    console.log('THIS CONFIRMS WE ARE IN SANDBOX MODE.');
  }
}

checkSandbox();

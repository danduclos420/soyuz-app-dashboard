import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSandboxItems() {
  const { data: configData } = await supabase
    .from('app_config')
    .select('value')
    .eq('key', 'quickbooks_token')
    .single();

  const token = configData.value;
  const realmId = token.realmId;
  const accessToken = token.access_token;

  console.log(`Checking Sandbox Items for Realm: ${realmId}`);
  
  const url = `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/query?query=${encodeURIComponent("SELECT * FROM Item WHERE Active = true")}&minorversion=65`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
    },
  });

  const data = await response.json();
  const items = data.QueryResponse.Item || [];
  console.log(`Total active items in Sandbox: ${items.length}`);
  items.forEach((i: any) => {
    console.log(`- Item: ${i.Name}, SKU: ${i.Sku || 'MISSING'}, Type: ${i.Type}`);
  });
}

checkSandboxItems();

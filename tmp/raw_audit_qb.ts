import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function rawAudit() {
  console.log('Fetching token...');
  const { data: configData } = await supabase
    .from('app_config')
    .select('value')
    .eq('key', 'quickbooks_token')
    .single();

  const token = configData.value;
  const realmId = token.realmId;
  const accessToken = token.access_token;

  console.log(`Auditing Realm: ${realmId}`);
  
  const query = "SELECT count(*) FROM Item WHERE Active = true";
  const url = `https://quickbooks.api.intuit.com/v3/company/${realmId}/query?query=${encodeURIComponent(query)}&minorversion=65`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    console.error('QB API Error:', response.status, response.statusText);
    const text = await response.text();
    console.error('Body:', text);
    return;
  }

  const data = await response.json();
  console.log('QB Response:', JSON.stringify(data, null, 2));

  // Now let's see if there are items with SKUs
  const skuQuery = "SELECT * FROM Item WHERE Active = true AND Sku != null";
  const skuUrl = `https://quickbooks.api.intuit.com/v3/company/${realmId}/query?query=${encodeURIComponent(skuQuery)}&minorversion=65`;

  const skuResponse = await fetch(skuUrl, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
    },
  });

  const skuData = await skuResponse.json();
  const itemsWithSku = skuData.QueryResponse.Item || [];
  console.log(`Found ${itemsWithSku.length} items with SKUs.`);
  if (itemsWithSku.length > 0) {
    console.log('Sample item with SKU:', itemsWithSku[0].Name, itemsWithSku[0].Sku);
  } else {
    // If no items with SKU, show what items DO exist
    const anyQuery = "SELECT * FROM Item WHERE Active = true LIMIT 5";
    const anyUrl = `https://quickbooks.api.intuit.com/v3/company/${realmId}/query?query=${encodeURIComponent(anyQuery)}&minorversion=65`;
    const anyRes = await fetch(anyUrl, { headers: { 'Authorization': `Bearer ${accessToken}`, 'Accept': 'application/json' } });
    const anyData = await anyRes.json();
    console.log('Sample items (any):');
    console.table((anyData.QueryResponse.Item || []).map((i: any) => ({ Name: i.Name, Sku: i.Sku || 'NONE', Type: i.Type })));
  }
}

rawAudit();

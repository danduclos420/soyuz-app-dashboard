import { createClient } from '@supabase/supabase-js';
import { getQBInventoryItems } from '../lib/quickbooks';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugAudit() {
  console.log('Fetching token from Supabase...');
  const { data: configData, error: configError } = await supabase
    .from('app_config')
    .select('value')
    .eq('key', 'quickbooks_token')
    .single();

  if (configError) {
    console.error('Error fetching token:', configError);
    return;
  }

  const token = configData.value;
  console.log('Token found. Fetching items from QuickBooks...');
  
  try {
    const res = await getQBInventoryItems(token);
    console.log('Audit Results:');
    console.log(`Total active items in QB: ${res.audit.total}`);
    console.log('Types distribution:', res.audit.types);
    console.log(`Items with SKUs and valid types: ${res.audit.valid}`);
    
    if (res.items.length > 0) {
      console.log('First 3 valid items:');
      console.table(res.items.slice(0, 3).map((i: any) => ({ Name: i.Name, SKU: i.Sku, Type: i.Type, Qty: i.QtyOnHand })));
    } else {
      console.log('NO VALID ITEMS FOUND. This is why the sync count is 0.');
      // Let's see some invalid ones to understand why
      const { data: qbRaw } = await (await fetch(`https://quickbooks.api.intuit.com/v3/company/${token.realmId}/query?query=${encodeURIComponent("SELECT * FROM Item WHERE Active = true LIMIT 5")}&minorversion=65`, {
        headers: {
          'Authorization': `Bearer ${token.access_token}`,
          'Accept': 'application/json',
        },
      })).json();
      console.log('Sample raw items from QB:');
      console.table((qbRaw.QueryResponse.Item || []).map((i: any) => ({ Name: i.Name, SKU: i.Sku || 'MISSING', Type: i.Type })));
    }
  } catch (err: any) {
    console.error('Audit failed with error:');
    if (err.message) console.error('Message:', err.message);
    if (err.stack) console.error('Stack:', err.stack);
    console.error('Full error object:', JSON.stringify(err, null, 2));
  }
}

debugAudit();

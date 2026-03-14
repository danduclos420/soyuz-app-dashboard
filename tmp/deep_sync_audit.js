
const { createClient } = require('@supabase/supabase-js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function deepAudit() {
  console.log('--- AUDIT SYNCHRO ERPLAIN -> QB ---');
  
  // 1. Check local DB state
  const { data: epProducts, error: epError } = await supabase
    .from('product_variants')
    .select('*, products(*)')
    .not('sku', 'is', null)
    .limit(10);
    
  if (epError) {
    console.error('Error fetching variants:', epError);
    return;
  }

  console.log(`Found ${epProducts.length} variants in DB sample.`);
  epProducts.forEach(v => {
    console.log(`- SKU: ${v.sku} | Name: ${v.name} | ProdName: ${v.products?.name} | Category: ${v.products?.category}`);
  });

  // 2. Check sync logic against first item
  if (epProducts.length > 0) {
    const v = epProducts[0];
    const name = v.name || v.products?.name || '';
    const category = v.products?.category || '';
    const description = v.products?.description || '';
    
    const isHockeyStick = 
      category.toLowerCase().includes('hockey stick') ||
      category.toLowerCase().includes('bâton') ||
      name.toLowerCase().includes('hockey stick') || 
      name.toLowerCase().includes('baton') ||
      name.toLowerCase().includes('bâton') ||
      name.toLowerCase().includes('stick') ||
      description.toLowerCase().includes('hockey stick') ||
      description.toLowerCase().includes('baton') ||
      description.toLowerCase().includes('bâton');
      
    console.log('\n--- SIMULATION LOGIQUE FILTRAGE ---');
    console.log(`Testing: ${name}`);
    console.log(`- Match Category: ${category.toLowerCase().includes('hockey stick') || category.toLowerCase().includes('bâton')}`);
    console.log(`- Match Name/Stick: ${name.toLowerCase().includes('stick') || name.toLowerCase().includes('baton') || name.toLowerCase().includes('bâton')}`);
    console.log(`RESULT: ${isHockeyStick ? '✅ DETECTED AS STICK' : '❌ IGNORED'}`);
  }

  // 3. Check QB Token and Category
  const { data: configData } = await supabase
    .from('app_config')
    .select('value')
    .eq('key', 'quickbooks_token')
    .single();

  if (!configData) {
    console.error('QB Token missing.');
    return;
  }

  const token = configData.value;
  console.log('\n--- QB CONFIG ---');
  console.log(`Realm ID: ${token.realmId}`);
  console.log(`Environment: ${token.environment}`);

  const config = {
    apiUri: token.environment === 'production' 
      ? 'https://quickbooks.api.intuit.com/v3/company' 
      : 'https://sandbox-quickbooks.api.intuit.com/v3/company'
  };

  const catQuery = "SELECT * FROM Item WHERE Type = 'Category' AND Name = 'Hockey Sticks'";
  const url = `${config.apiUri}/${token.realmId}/query?query=${encodeURIComponent(catQuery)}&minorversion=65`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token.access_token}`,
      'Accept': 'application/json',
    },
  });

  if (response.ok) {
    const data = await response.json();
    console.log('QB Category Search Result:', JSON.stringify(data.QueryResponse, null, 2));
  } else {
    console.error('QB API Error:', await response.text());
  }
}

deepAudit();

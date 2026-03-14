import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSchema() {
  console.log('Checking columns for "products" table...');
  const { data: pCols, error: pErr } = await supabase.rpc('get_columns_for_table', { table_name: 'products' });
  if (pErr) {
    // Fallback if RPC not available: try a sample select
    console.log('RPC failed, trying sample select...');
    const { data: pSample, error: pSampleErr } = await supabase.from('products').select('*').limit(1);
    if (pSampleErr) console.error('Products Error:', pSampleErr);
    else console.log('Products sample keys:', Object.keys(pSample[0] || {}));
  } else {
    console.log('Products columns:', pCols);
  }

  console.log('Checking columns for "product_variants" table...');
  const { data: vSample, error: vSampleErr } = await supabase.from('product_variants').select('*').limit(1);
  if (vSampleErr) console.error('Variants Error:', vSampleErr);
  else console.log('Variants sample keys:', Object.keys(vSample[0] || {}));
}

checkSchema();

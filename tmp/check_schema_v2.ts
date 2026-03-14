import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkRealSchema() {
  console.log('Querying information_schema for products...');
  const { data: pCols, error: pErr } = await supabase
    .from('information_schema.columns' as any)
    .select('column_name')
    .eq('table_name', 'products')
    .eq('table_schema', 'public');
  
  if (pErr) {
    console.error('Products Schema Error:', pErr);
  } else {
    console.log('Products columns:', pCols.map((c: any) => c.column_name));
  }

  console.log('Querying information_schema for product_variants...');
  const { data: vCols, error: vErr } = await supabase
    .from('information_schema.columns' as any)
    .select('column_name')
    .eq('table_name', 'product_variants')
    .eq('table_schema', 'public');
  
  if (vErr) {
    console.error('Variants Schema Error:', vErr);
  } else {
    console.log('Variants columns:', vCols.map((c: any) => c.column_name));
  }
}

checkRealSchema();

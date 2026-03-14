import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testVariantInsertDetailed() {
  console.log('Testing variant insert with detailed error logging...');
  
  const { data: products } = await supabase.from('products').select('id').limit(1).order('created_at', { ascending: false });
  if (!products || products.length === 0) {
    console.error('No products found to link variant to.');
    return;
  }
  const productId = products[0].id;

  const { data, error } = await supabase
    .from('product_variants')
    .insert({
      product_id: productId,
      sku: 'TEMP-SKU-' + Date.now(),
      name: 'Test Variant Name'
    })
    .select();

  if (error) {
    console.log('--- ERROR START ---');
    console.log('Code:', error.code);
    console.log('Message:', error.message);
    console.log('Details:', error.details);
    console.log('Hint:', error.hint);
    console.log('--- ERROR END ---');
  } else {
    console.log('Insert Success!', data);
  }
}

testVariantInsertDetailed();

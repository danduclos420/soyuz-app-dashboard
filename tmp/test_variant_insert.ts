import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testVariantInsert() {
  console.log('Testing variant insert...');
  
  // Get the product we just created
  const { data: products } = await supabase.from('products').select('id').limit(1).order('created_at', { ascending: false });
  const productId = products[0].id;

  const { data, error } = await supabase
    .from('product_variants')
    .insert({
      product_id: productId,
      sku: 'TEST-SKU-' + Date.now(),
      name: 'Test Variant'
    })
    .select();

  if (error) {
    console.error('Variant Insert Error:', error);
  } else {
    console.log('Variant Insert Success! Result:', data);
  }
}

testVariantInsert();

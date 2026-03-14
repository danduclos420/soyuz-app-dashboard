import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testInsert() {
  console.log('Testing minimal insert into products...');
  const { data, error } = await supabase
    .from('products')
    .insert({
      name: 'Test Product',
      slug: 'test-product-' + Date.now()
    })
    .select();

  if (error) {
    console.error('Insert Error:', error);
  } else {
    console.log('Insert Success! Result:', data);
  }
}

testInsert();

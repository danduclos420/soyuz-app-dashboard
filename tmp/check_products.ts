import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkProducts() {
  console.log('Checking synced products...');
  const { count, error } = await supabase
    .from('product_variants')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log(`Total variants in database: ${count}`);
  
  const { data: recent, error: recentError } = await supabase
    .from('product_variants')
    .select('sku, stock_qty, updated_at')
    .order('updated_at', { ascending: false })
    .limit(5);
    
  if (recentError) {
    console.error('Error fetching recent variants:', recentError);
    return;
  }
  
  console.log('Most recently updated variants:');
  console.table(recent);
}

checkProducts();

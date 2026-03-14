
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function main() {
  console.log('--- AUDIT DB TYPESCRIPT ---');
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing ENV vars in .env.local');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: products, error: pError } = await supabase
    .from('products')
    .select('name, category, images, erplain_id')
    .limit(50);

  if (pError) {
    console.error('Error fetching products:', pError);
    return;
  }

  console.log(`Total items found in DB: ${products.length}`);
  console.table(products.map(p => ({
    name: p.name,
    category: p.category,
    hasImages: p.images?.length > 0,
    erplain_id: p.erplain_id
  })));

  const { count: vCount } = await supabase
    .from('product_variants')
    .select('*', { count: 'exact', head: true });
  
  console.log(`Total variants in DB: ${vCount}`);
}

main();

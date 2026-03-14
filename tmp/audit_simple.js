
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envContent = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^"(.*)"$/, '$1');
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

async function runAudit() {
  console.log('--- DB AUDIT START ---');
  if (!supabaseUrl || !supabaseKey) {
    console.error('FAILED: Env variables not found in .env.local');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: products, error } = await supabase
    .from('products')
    .select('name, category, images, erplain_id')
    .limit(50);

  if (error) {
    console.error('Supabase Error:', error);
    return;
  }

  console.log(`Found ${products.length} products.`);
  products.forEach(p => {
    console.log(`[${p.erplain_id}] ${p.name} | Cat: ${p.category} | Imgs: ${p.images?.length || 0}`);
  });
  
  const { count } = await supabase.from('product_variants').select('*', { count: 'exact', head: true });
  console.log(`Total Variants: ${count}`);
}

runAudit();

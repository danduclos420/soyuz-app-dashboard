
const { createClient } = require('@supabase/supabase-js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Manually set from previous knowledge or environment if accessible
const supabaseUrl = 'https://ppbboujuyrnumzxeikmm.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'MISSING'; 

async function audit() {
  console.log('--- AUDIT DB SOYUZ ---');
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { count: pCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
  const { count: vCount } = await supabase.from('product_variants').select('*', { count: 'exact', head: true });

  console.log(`Total Products in DB: ${pCount}`);
  console.log(`Total Variants in DB: ${vCount}`);

  const { data: samples } = await supabase.from('products').select('name, category, images, erplain_id').limit(10);
  console.log('\nDerniers produits importés :');
  console.table(samples?.map(p => ({
    name: p.name,
    cat: p.category,
    hasImages: p.images?.length > 0,
    erplain_id: p.erplain_id
  })));
}

if (supabaseKey === 'MISSING') {
  console.error('ERREUR: Clé Supabase manquante. Je dois la récupérer via get-env.');
} else {
  audit();
}

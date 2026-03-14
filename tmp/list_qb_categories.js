
const { createClient } = require('@supabase/supabase-js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function listCategories() {
  console.log('--- RECHERCHE CATÉGORIE HOCKEY STICKS ---');
  
  const { data: configData } = await supabase
    .from('app_config')
    .select('value')
    .eq('key', 'quickbooks_token')
    .single();

  if (!configData) {
    console.error('QB non connecté.');
    return;
  }

  const token = configData.value;
  const env = token.environment || 'production';
  const apiUri = (env === 'production') 
    ? 'https://quickbooks.api.intuit.com/v3/company' 
    : 'https://sandbox-quickbooks.api.intuit.com/v3/company';

  const query = "SELECT * FROM Item WHERE Type = 'Category'";
  const url = `${apiUri}/${token.realmId}/query?query=${encodeURIComponent(query)}&minorversion=65`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token.access_token}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    console.error('Erreur API QB:', await response.text());
    return;
  }

  const data = await response.json();
  const categories = data.QueryResponse.Item || [];
  
  console.log('Catégories trouvées:');
  categories.forEach(cat => {
    console.log(`- [${cat.Id}] ${cat.Name}`);
  });

  const hockeyCat = categories.find(c => c.Name.toLowerCase().includes('hockey stick'));
  if (hockeyCat) {
    console.log(`\n✅ TROUVÉ: "${hockeyCat.Name}" ID = ${hockeyCat.Id}`);
  } else {
    console.log('\n❌ Catégorie "Hockey Sticks" non trouvée.');
  }
}

listCategories();

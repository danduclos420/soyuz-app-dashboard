
const { createClient } = require('@supabase/supabase-client');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkToken() {
  console.log('--- AUDIT JETON QUICKBOOKS ---');
  const { data, error } = await supabase
    .from('app_config')
    .select('*')
    .eq('key', 'quickbooks_token')
    .maybeSingle();

  if (error) {
    console.error('Erreur Supabase:', error);
    return;
  }

  if (!data) {
    console.log('Aucun jeton trouvé dans app_config.');
    return;
  }

  console.log('ID:', data.id);
  console.log('Clé:', data.key);
  console.log('Mis à jour le:', data.updated_at);
  
  const token = data.value;
  console.log('--- CONTENU DU JETON ---');
  console.log('Realm ID:', token.realmId);
  console.log('Environnement:', token.environment);
  console.log('Date expiration:', token.expires_at ? new Date(token.expires_at).toLocaleString() : 'N/A');
  
  if (token.realmId === '9341456597297212') {
    console.log('⚠️ ALERTE : Le Realm ID correspond au SANDBOX.');
  } else if (token.realmId === '9341454962337455') {
    console.log('✅ Le Realm ID correspond à la PRODUCTION (Protos).');
  } else {
    console.log('❓ Realm ID inconnu:', token.realmId);
  }
}

checkToken();

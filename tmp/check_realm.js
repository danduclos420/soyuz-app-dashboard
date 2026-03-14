const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ppbboujuyrnumzxeikmm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwYmJvdWp1eXJudW16eGVpa21tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzMzODA5NiwiZXhwIjoyMDg4OTE0MDk2fQ.v7frFgSxkHnmx3MQS7o0S8ykNF8sT8t2A8Cz4BG1JTU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRealm() {
  console.log('--- Checking QB Token in Supabase ---');
  
  const { data, error } = await supabase.from('app_config').select('value').eq('key', 'quickbooks_token').single();
  
  if (error) {
    console.error('Error fetching token:', error.message);
    return;
  }
  
  if (data && data.value) {
    console.log('Current Realm ID:', data.value.realmId);
  } else {
    console.log('No token found.');
  }
}

checkRealm();

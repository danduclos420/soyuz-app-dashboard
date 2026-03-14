const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ppbboujuyrnumzxeikmm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwYmJvdWp1eXJudW16eGVpa21tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzMzODA5NiwiZXhwIjoyMDg4OTE0MDk2fQ.v7frFgSxkHnmx3MQS7o0S8ykNF8sT8t2A8Cz4BG1JTU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkToken() {
  console.log('Checking stored QuickBooks token...');
  try {
    const { data: qbTokenRows, error: qbError } = await supabase
      .from('app_config')
      .select('*')
      .eq('key', 'quickbooks_token');

    if (qbError) throw qbError;

    if (qbTokenRows.length === 0) {
      console.log('No quickbooks_token found in app_config.');
    } else {
      qbTokenRows.forEach(row => {
        console.log('--- Token Row ---');
        console.log('Realm ID:', row.value.realmId);
        console.log('Updated At:', row.updated_at);
        console.log('Expires At:', row.value.expires_at ? new Date(row.value.expires_at).toLocaleString() : 'N/A');
        console.log('Environment:', row.value.environment || 'N/A');
      });
    }

    const { data: envRows } = await supabase.from('app_config').select('*').eq('key', 'quickbooks_environment');
    if (envRows) {
        envRows.forEach(row => console.log('Stored Environment Setting:', row.value));
    }

  } catch (err) {
    console.error('Error during token check:', err);
  }
}

checkToken();

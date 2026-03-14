const { createClient } = require('@supabase/supabase-js');
// native fetch used

const SUPABASE_URL = 'https://ppbboujuyrnumzxeikmm.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwYmJvdWp1eXJudW16eGVpa21tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzMzODA5NiwiZXhwIjoyMDg4OTE0MDk2fQ.v7frFgSxkHnmx3MQS7o0S8ykNF8sT8t2A8Cz4BG1JTU';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function testApi() {
  console.log('--- QuickBooks Production API Diagnostic ---');
  
  const { data: configData, error: configError } = await supabase
    .from('app_config')
    .select('*')
    .eq('key', 'quickbooks_token')
    .single();

  if (configError || !configData) {
    console.error('No token found in database.');
    return;
  }

  const token = configData.value;
  const realmId = token.realmId;
  const accessToken = token.access_token;

  console.log(`Using Realm ID: ${realmId}`);
  console.log(`Environment: Production`);
  console.log(`Token expires at: ${new Date(token.expires_at).toLocaleString()}`);

  const endpoints = [
    {
      name: 'CompanyInfo',
      url: `https://quickbooks.api.intuit.com/v3/company/${realmId}/companyinfo/${realmId}?minorversion=40`
    },
    {
      name: 'Item Query (v65)',
      url: `https://quickbooks.api.intuit.com/v3/company/${realmId}/query?query=SELECT * FROM Item MAXRESULTS 1&minorversion=65`
    },
    {
      name: 'Item Query (v4)',
      url: `https://quickbooks.api.intuit.com/v3/company/${realmId}/query?query=SELECT * FROM Item MAXRESULTS 1&minorversion=4`
    }
  ];

  for (const ep of endpoints) {
    console.log(`\nTesting ${ep.name}...`);
    try {
      const res = await fetch(ep.url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });

      console.log(`Status: ${res.status} ${res.statusText}`);
      const data = await res.json();
      
      if (res.ok) {
        console.log(`SUCCESS! Data:`, JSON.stringify(data).substring(0, 100) + '...');
      } else {
        console.log(`FAILED:`, JSON.stringify(data));
      }
    } catch (err) {
      console.error(`Error during ${ep.name}:`, err.message);
    }
  }
}

testApi();

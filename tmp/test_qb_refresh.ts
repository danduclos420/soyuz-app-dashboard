import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const clientId = process.env.QUICKBOOKS_CLIENT_ID!;
const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET!;
const tokenUri = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';

async function testRefresh() {
  console.log('Fetching token from Supabase...');
  const { data: configData } = await supabase
    .from('app_config')
    .select('value')
    .eq('key', 'quickbooks_token')
    .single();

  const token = configData.value;
  const refreshToken = token.refresh_token;

  console.log('Attempting to refresh token...');
  const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  const response = await fetch(tokenUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${authHeader}`,
      'Accept': 'application/json',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    console.error('Refresh Failed:', response.status, response.statusText);
    const text = await response.text();
    console.error('Error Body:', text);
  } else {
    const data = await response.json();
    console.log('Refresh Successful!');
    const newAccessToken = data.access_token;
    
    // Test a query with the NEW token
    const realmId = token.realmId;
    const query = "SELECT count(*) FROM Item WHERE Active = true";
    const url = `https://quickbooks.api.intuit.com/v3/company/${realmId}/query?query=${encodeURIComponent(query)}&minorversion=65`;

    console.log(`Testing query with NEW token for Realm: ${realmId}`);
    const qRes = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${newAccessToken}`,
        'Accept': 'application/json',
      },
    });

    if (qRes.ok) {
      const qData = await qRes.json();
      console.log('Query Successful!', JSON.stringify(qData, null, 2));
    } else {
      console.error('Query Failed with new token:', qRes.status, qRes.statusText);
      console.error('Body:', await qRes.text());
    }
  }
}

testRefresh();

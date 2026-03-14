
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Parse .env.local
const envContent = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^"(.*)"$/, '$1');
  }
});

const erplainKey = env.ERPLAIN_API_KEY;
const erplainUrl = env.ERPLAIN_API_URL || 'https://app.erplain.net/public-api/graphql/endpoint';

async function testErplain() {
  console.log('--- ERPLAIN API TEST ---');
  if (!erplainKey) {
    console.error('FAILED: ERPLAIN_API_KEY not found');
    return;
  }

  const query = `
    query {
      products {
        id
        name
        reference
        category {
          name
        }
      }
    }
  `;

  try {
    const response = await fetch(erplainUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${erplainKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const body = await response.json();
    if (!response.ok) {
      console.error(`API Error (${response.status}):`, JSON.stringify(body, null, 2));
      return;
    }

    const products = body.data?.products || [];
    console.log(`Successfully fetched ${products.length} products from Erplain.`);
    products.slice(0, 10).forEach(p => {
      console.log(`- [${p.id}] ${p.name} (${p.category?.name})`);
    });
  } catch (err) {
    console.error('Fetch Error:', err);
  }
}

testErplain();

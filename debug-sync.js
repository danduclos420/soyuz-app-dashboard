const { syncErplainProducts } = require('./lib/erplain');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function debug() {
  console.log('Testing Erplain Sync...');
  try {
    const result = await syncErplainProducts();
    console.log('Result:', result);
  } catch (err) {
    console.error('CRASH:', err);
  }
}

debug();

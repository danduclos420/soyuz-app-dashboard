import { syncErplainProducts } from './lib/erplain';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function debug() {
  console.log('Testing Erplain Sync via TSX...');
  try {
    const result = await syncErplainProducts();
    console.log('Result:', result);
  } catch (err) {
    console.error('CRASH:', err);
  }
}

debug();

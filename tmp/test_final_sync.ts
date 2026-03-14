import { syncQuickBooksInventory } from '../lib/quickbooks';

// Manually override environment for this test
process.env.QUICKBOOKS_ENVIRONMENT = 'sandbox';

async function testFinalSync() {
  console.log('Testing sync with corrected environment (SANDBOX)...');
  const result = await syncQuickBooksInventory();
  console.log('Sync Result:', JSON.stringify(result, null, 2));
}

testFinalSync();

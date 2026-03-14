import { syncQuickBooksInventory } from '../lib/quickbooks';
const debugSync = async () => {
  console.log('Running real sync function...');
  const result = await syncQuickBooksInventory();
  console.log('Sync Result:', JSON.stringify(result, null, 2));
}

debugSync();

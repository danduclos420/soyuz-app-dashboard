import { pushErplainProductsToQB } from '../lib/erplain-to-qb';

async function testPush() {
  try {
    console.log('Testing Erplain -> QuickBooks Push...');
    const result = await pushErplainProductsToQB();
    console.log('Result:', result);
  } catch (error) {
    console.error('Test Failed:', error);
  }
}

testPush();

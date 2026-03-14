const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ppbboujuyrnumzxeikmm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwYmJvdWp1eXJudW16eGVpa21tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzMzODA5NiwiZXhwIjoyMDg4OTE0MDk2fQ.v7frFgSxkHnmx3MQS7o0S8ykNF8sT8t2A8Cz4BG1JTU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function audit() {
  console.log('--- Database Audit ---');
  
  const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
  const { count: variantCount } = await supabase.from('product_variants').select('*', { count: 'exact', head: true });
  
  console.log(`Products in DB: ${productCount}`);
  console.log(`Variants in DB: ${variantCount}`);
  
  if (productCount > 0) {
    const { data: samples } = await supabase.from('products').select('name, category').limit(5);
    console.log('Sample Products:', samples);
  }
}

audit();

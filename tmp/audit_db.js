const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ppbboujuyrnumzxeikmm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwYmJvdWp1eXJudW16eGVpa21tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzMzODA5NiwiZXhwIjoyMDg4OTE0MDk2fQ.v7frFgSxkHnmx3MQS7o0S8ykNF8sT8t2A8Cz4BG1JTU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: products, error: pError } = await supabase.from('products').select('*');
  const { data: variants, error: vError } = await supabase.from('product_variants').select('*');
  
  console.log('Products:', JSON.stringify(products, null, 2));
  console.log('Variants:', JSON.stringify(variants, null, 2));
}

check();

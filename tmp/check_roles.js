const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ppbboujuyrnumzxeikmm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwYmJvdWp1eXJudW16eGVpa21tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzMzODA5NiwiZXhwIjoyMDg4OTE0MDk2fQ.v7frFgSxkHnmx3MQS7o0S8ykNF8sT8t2A8Cz4BG1JTU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('profiles').select('email, role').eq('role', 'devtool');
  if (error) {
    console.error('Error fetching profiles:', error);
  } else {
    console.log('DevTool users found:', JSON.stringify(data, null, 2));
  }
}

check();

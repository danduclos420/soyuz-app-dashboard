const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://ppbboujuyrnumzxeikmm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwYmJvdWp1eXJudW16eGVpa21tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzMzODA5NiwiZXhwIjoyMDg4OTE0MDk2fQ.v7frFgSxkHnmx3MQS7o0S8ykNF8sT8t2A8Cz4BG1JTU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const sqlFile = process.argv[2];
  if (!sqlFile) {
    console.error('Usage: node run_migration.js <file.sql>');
    process.exit(1);
  }
  
  const sql = fs.readFileSync(sqlFile, 'utf8');
  console.log(`Running migration from ${sqlFile}...`);
  
  const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
  
  if (error) {
    console.error('Migration Failed:', error);
    process.exit(1);
  } else {
    console.log('Migration Successful!');
  }
}

run();

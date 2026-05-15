
const { createClient } = require('@libsql/client');
const client = createClient({
  url: process.argv[2],
  authToken: process.argv[3]
});

async function main() {
  const queries = [
    "ALTER TABLE User ADD COLUMN profileBackground TEXT;",
    "ALTER TABLE User ADD COLUMN isShadowBanned INTEGER DEFAULT 0;",
    "CREATE TABLE IF NOT EXISTS LinkStats (id TEXT PRIMARY KEY, url TEXT UNIQUE, threadId TEXT UNIQUE, views INTEGER DEFAULT 0, updatedAt DATETIME);"
  ];

  for (const query of queries) {
    try {
      console.log('Executing:', query);
      await client.execute(query);
      console.log('Success.');
    } catch (e) {
      if (e.message.includes('duplicate column name') || e.message.includes('already exists')) {
        console.log('Already exists, skipping.');
      } else {
        console.error('Failed:', e.message);
      }
    }
  }
}

main().finally(() => process.exit(0));

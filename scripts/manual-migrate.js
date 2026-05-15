
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting manual migration for Turso DB...');
  
  const queries = [
    "ALTER TABLE User ADD COLUMN profileBackground TEXT;",
    "ALTER TABLE User ADD COLUMN isShadowBanned BOOLEAN DEFAULT 0;",
    "CREATE TABLE IF NOT EXISTS LinkStats (id TEXT PRIMARY KEY, url TEXT UNIQUE, threadId TEXT UNIQUE, views INTEGER DEFAULT 0, updatedAt DATETIME);"
  ];

  for (const query of queries) {
    try {
      console.log(`Executing: ${query}`);
      await prisma.$executeRawUnsafe(query);
      console.log('Success.');
    } catch (e) {
      if (e.message.includes('duplicate column name') || e.message.includes('already exists')) {
        console.log('Already exists, skipping.');
      } else {
        console.error(`Failed: ${e.message}`);
      }
    }
  }
}

main().finally(() => prisma.$disconnect());

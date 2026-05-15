
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const result = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table'`;
    console.log('Tables in DB:', JSON.stringify(result, null, 2));
  } catch (e) {
    console.error('Error fetching tables:', e.message);
  }
}

main().finally(() => prisma.$disconnect());

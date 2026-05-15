const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up FTS5 tables...');
  try {
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS Comment_FTS;`);
    await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS comment_ai;`);
    await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS comment_ad;`);
    await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS comment_au;`);
    console.log('Cleanup successful.');
  } catch (error) {
    console.error('Cleanup failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

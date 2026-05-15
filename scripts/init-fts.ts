import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Initializing FTS5 for SQLite...');

  try {
    // 1. Create the virtual table for full-text search
    await prisma.$executeRawUnsafe(`
      CREATE VIRTUAL TABLE IF NOT EXISTS Comment_FTS USING fts5(
        id UNINDEXED,
        content,
        url,
        content='Comment',
        content_rowid='id'
      );
    `);

    // 2. Create triggers to keep the FTS table in sync
    // After Insert
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER IF NOT EXISTS comment_ai AFTER INSERT ON Comment BEGIN
        INSERT INTO Comment_FTS(rowid, id, content, url) VALUES (new.id, new.id, new.content, new.url);
      END;
    `);

    // After Delete
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER IF NOT EXISTS comment_ad AFTER DELETE ON Comment BEGIN
        INSERT INTO Comment_FTS(Comment_FTS, rowid, id, content, url) VALUES('delete', old.id, old.id, old.content, old.url);
      END;
    `);

    // After Update
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER IF NOT EXISTS comment_au AFTER UPDATE ON Comment BEGIN
        INSERT INTO Comment_FTS(Comment_FTS, rowid, id, content, url) VALUES('delete', old.id, old.id, old.content, old.url);
        INSERT INTO Comment_FTS(rowid, id, content, url) VALUES (new.id, new.id, new.content, new.url);
      END;
    `);

    // 3. Populate initial data if FTS table is empty
    const ftsCount = await prisma.$queryRawUnsafe('SELECT count(*) as count FROM Comment_FTS') as any[];
    if (ftsCount[0].count === 0) {
      console.log('Populating FTS table with existing comments...');
      await prisma.$executeRawUnsafe(`
        INSERT INTO Comment_FTS(rowid, id, content, url)
        SELECT id, id, content, url FROM Comment;
      `);
    }

    console.log('FTS5 initialization successful.');
  } catch (error) {
    console.error('FTS5 initialization failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

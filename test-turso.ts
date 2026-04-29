import { createClient } from '@libsql/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { PrismaClient } from '@prisma/client';

async function main() {
  const url = process.env.DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  console.log('URL:', url?.substring(0, 20));
  
  const libsql = createClient({ url: url!, authToken });
  const adapter = new PrismaLibSQL(libsql);
  const prisma = new PrismaClient({ adapter });

  try {
    const users = await prisma.user.findMany();
    console.log('Users count:', users.length);
  } catch (e) {
    console.error('Error:', e);
  }
}

main();

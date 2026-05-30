import { PrismaClient } from '@prisma/client'
import { createClient } from '@libsql/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'

// Read/Write Splitting Helper
// 데이터베이스 쓰기는 process.env.DATABASE_URL(또는 마스터)
// 데이터베이스 읽기는 process.env.DATABASE_READ_URL(또는 복제본)이 설정되어 있을 시 읽기전용 복제본(ReadOnly Replica)에서 수행합니다.

const createPrismaInstance = (dbUrl: string, token?: string) => {
  if (!dbUrl) {
    // 런타임 오류 방지를 위해 디폴트 SQLite 경로 반환
    return new PrismaClient();
  }
  const isTurso = dbUrl.startsWith('libsql')
  if (isTurso) {
    const libsql = createClient({
      url: dbUrl,
      authToken: token,
    })
    const adapter = new PrismaLibSQL(libsql)
    return new PrismaClient({ adapter })
  }
  return new PrismaClient({ datasources: { db: { url: dbUrl } } })
}

let writeClient: PrismaClient;
let readClient: PrismaClient;

export const getDbClients = () => {
  if (!writeClient) {
    const mainUrl = process.env.DATABASE_URL || 'file:./dev.db';
    const mainToken = process.env.TURSO_AUTH_TOKEN;
    writeClient = createPrismaInstance(mainUrl, mainToken);
  }

  if (!readClient) {
    const readUrl = process.env.DATABASE_READ_URL;
    const readToken = process.env.TURSO_READ_AUTH_TOKEN;
    
    if (readUrl) {
      console.log("[DB-SPLIT] Read-only Replica Database is active.");
      readClient = createPrismaInstance(readUrl, readToken);
    } else {
      console.log("[DB-SPLIT] Read-only URL not found. Using main DB for reads.");
      readClient = writeClient;
    }
  }

  return {
    write: writeClient,
    read: readClient,
  };
}

/**
 * 쿼리 타입에 따라 알맞은 Prisma Client를 동적으로 리턴하는 함수
 * @param type 'read' | 'write'
 */
export const db = (type: 'read' | 'write' = 'write') => {
  const clients = getDbClients();
  return type === 'read' ? clients.read : clients.write;
}

import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({
    dbUrlPrefix: process.env.DATABASE_URL?.substring(0, 15),
    isTurso: process.env.DATABASE_URL?.startsWith('libsql'),
    hasAuthSecret: !!process.env.AUTH_SECRET,
    hasGoogleId: !!process.env.GOOGLE_CLIENT_ID,
    hasGoogleSecret: !!process.env.GOOGLE_CLIENT_SECRET,
  });
}

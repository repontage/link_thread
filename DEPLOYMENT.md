# Vercel Deployment & DB Migration Guide

## 1. Current State
현재 프로젝트는 **100% 무료 로컬 환경** 원칙에 따라 `SQLite`를 데이터베이스로 사용 중입니다. 
Vercel과 같은 Serverless 호스팅 환경에서는 파일 시스템이 휘발성이므로, 배포 전 데이터베이스를 클라우드(Free Tier)로 마이그레이션해야 합니다.

## 2. Free Tier DB Options
1. **Vercel Postgres (Free)**: 가장 Vercel 친화적.
2. **Supabase (Free)**: PostgreSQL 기반, Prisma와 궁합이 좋음.
3. **Turso (Free)**: SQLite 호환 (LibSQL). 코드 변경 없이 URL만 바꾸면 되어 가장 추천.

## 3. Deployment Steps
1. **Turso DB 생성**: `turso db create link-thread-db`
2. **`.env` 업데이트**: 
   ```env
   DATABASE_URL="libsql://link-thread-db-your-id.turso.io?authToken=YOUR_TOKEN"
   ```
3. **Prisma Provider 변경** (`schema.prisma`):
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
4. **Vercel 배포**:
   - Vercel CLI 또는 GitHub 연동.
   - Environment Variables에 `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` 등록.
   - Build Command: `npx prisma generate && npx prisma db push && next build`

## 4. Production Build Check
배포 전 로컬 환경에서 `npm run build`를 실행하여 TypeScript 오류, ESLint 경고, PWA 서비스 워커 생성 여부를 모두 점검 완료했습니다.

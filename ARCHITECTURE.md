# LinkThread ARCHITECTURE.md

## Structure
- `app/api/`: Backend endpoints (Auth, Comments, AI).
- `lib/`: Shared utilities (Prisma, Telegram Logger, AI Services).
- `scripts/`: Operational tools (DB Sync Check).

## Database
- SQLite (Local `dev.db`) for development.
- Turso (Remote LibSQL) for production.
- Prisma ORM for schema management.

## Monitoring
- Telegram integration for critical system errors and daily statistics.
- Automated migration status checks during CI/CD or via `check-db-sync.sh`.

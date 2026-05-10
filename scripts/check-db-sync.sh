#!/bin/bash
# workspace/link-thread-project/scripts/check-db-sync.sh

echo "🔍 Checking LinkThread Prisma Migration Status..."

STATUS_OUTPUT=$(npx prisma migrate status 2>&1)
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ Database is in sync with schema."
  exit 0
else
  echo "❌ Database out of sync or migration needed!"
  echo "$STATUS_OUTPUT"
  exit 1
fi

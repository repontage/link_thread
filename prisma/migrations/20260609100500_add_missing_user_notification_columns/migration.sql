-- AlterTable
ALTER TABLE "User" ADD COLUMN "isPro" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "subscriptionStatus" TEXT;
ALTER TABLE "User" ADD COLUMN "lsCustomerId" TEXT;
ALTER TABLE "User" ADD COLUMN "lsSubscriptionId" TEXT;
ALTER TABLE "User" ADD COLUMN "subscriptionEnd" DATETIME;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN "priority" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Notification_userId_priority_createdAt_idx" ON "Notification"("userId", "priority", "createdAt");

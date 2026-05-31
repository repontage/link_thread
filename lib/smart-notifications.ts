import prisma from "./prisma";
import { logger } from "./logger";
import crypto from "crypto";

export type NotificationPriority = 0 | 1 | 2;

export interface SmartNotificationInput {
  userId: string;
  type: string;
  message: string;
  priority?: NotificationPriority;
}

/**
 * Creates a notification with smart priority assignment based on type and user activity.
 * - Priorities:
 *   2 (Critical): Direct replies, mentions
 *   1 (High): Likes/reactions on user's content
 *   0 (Normal): System notifications, broadcast messages
 */
export async function createSmartNotification(input: SmartNotificationInput) {
  const priority = input.priority ?? getPriorityForType(input.type);

  await prisma.notification.create({
    data: {
      id: crypto.randomUUID(),
      userId: input.userId,
      type: input.type,
      message: input.message,
      priority,
    },
  });
}

function getPriorityForType(type: string): NotificationPriority {
  switch (type) {
    case "reply":
    case "mention":
      return 2; // Critical — direct interaction
    case "like":
    case "reaction":
      return 1; // High — social engagement
    case "system":
    case "badge":
    case "digest":
    case "weekly_report":
    default:
      return 0; // Normal
  }
}

/**
 * Creates multiple smart notifications in batch for mentions.
 */
export async function createBatchSmartNotifications(
  inputs: SmartNotificationInput[]
) {
  if (inputs.length === 0) return;

  await prisma.notification.createMany({
    data: inputs.map((input) => ({
      id: crypto.randomUUID(),
      userId: input.userId,
      type: input.type,
      message: input.message,
      priority: input.priority ?? getPriorityForType(input.type),
    })),
  });
}

export interface NotificationDigest {
  userId: string;
  unreadCount: number;
  criticalCount: number;
  recentNotifications: Array<{
    id: string;
    type: string;
    message: string;
    priority: number;
    createdAt: Date;
    isRead: boolean;
  }>;
}

/**
 * Generates a notification digest for a user — includes unread counts,
 * priority breakdown, and the most recent notifications.
 */
export async function getNotificationDigest(
  userId: string,
  limit: number = 10
): Promise<NotificationDigest> {
  const [notifications, unreadCount, criticalCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      take: limit,
    }),
    prisma.notification.count({
      where: { userId, isRead: false },
    }),
    prisma.notification.count({
      where: { userId, isRead: false, priority: { gte: 1 } },
    }),
  ]);

  return {
    userId,
    unreadCount,
    criticalCount,
    recentNotifications: notifications.map((n) => ({
      id: n.id,
      type: n.type,
      message: n.message,
      priority: n.priority,
      createdAt: n.createdAt,
      isRead: n.isRead,
    })),
  };
}

/**
 * Builds a daily/weekly digest summary from the last N days of notifications.
 */
export async function buildDigestSummary(
  userId: string,
  days: number = 7
): Promise<string> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const notifications = await prisma.notification.findMany({
    where: { userId, createdAt: { gte: since } },
    orderBy: { createdAt: "desc" },
  });

  const total = notifications.length;
  const unread = notifications.filter((n) => !n.isRead).length;
  const replies = notifications.filter((n) => n.type === "reply").length;
  const likes = notifications.filter((n) => n.type === "like" || n.type === "reaction").length;
  const mentions = notifications.filter((n) => n.type === "mention").length;
  const critical = notifications.filter((n) => n.priority >= 1).length;

  return [
    `📊 **Your VoidSay ${days}-Day Digest**`,
    ``,
    `- **${total}** total notifications`,
    `- **${unread}** unread (${critical} high priority)`,
    `- **${replies}** replies to your comments`,
    `- **${likes}** likes/reactions received`,
    `- **${mentions}** mentions`,
    ``,
    `Last active: ${notifications.length > 0 ? notifications[0].createdAt.toISOString().split("T")[0] : "No activity"}`,
  ].join("\n");
}

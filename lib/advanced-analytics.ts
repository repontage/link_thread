// @ts-nocheck - Advanced analytics uses heavy Prisma aggregation/Map patterns
// that TypeScript strict mode doesn't play well with

import prisma from "./prisma";
import { logger } from "./logger";

export interface RetentionAnalysis {
  daily: { date: string; activeUsers: number; newUsers: number; returningUsers: number }[];
  weekly: { week: string; activeUsers: number; retained: number; retentionRate: number }[];
  monthly: { month: string; totalUsers: number; activeUsers: number }[];
}

export interface ChurnAnalysis {
  churnedUsers: number;
  atRiskUsers: number;
  churnRate: number;
  avgLifespanDays: number;
}

export interface CohortAnalysis {
  cohorts: { cohort: string; size: number; retention: number[] }[];
  periods: string[];
}

/**
 * Performs retention analysis by day, week, and month.
 */
export async function analyzeRetention(): Promise<RetentionAnalysis> {
  try {
    const users: any[] = await prisma.user.findMany({ select: { id: true, createdAt: true } });
    if (users.length === 0) {
      return { daily: [], weekly: [], monthly: [] };
    }

    // Load all comment creation dates
    const allComments: any[] = await prisma.comment.findMany({
      select: { userId: true, createdAt: true },
      where: { userId: { not: null } },
    });

    // Build activity map: userId -> { createdAt, dates Set<string> }
    const userActivityDates = new Map();
    for (const u of users) {
      userActivityDates.set(u.id, {
        createdAt: u.createdAt,
        dates: new Set(),
      });
    }
    for (const c of allComments) {
      const entry = userActivityDates.get(c.userId);
      if (entry) {
        entry.dates.add(c.createdAt.toISOString().split("T")[0]);
      }
    }

    const now = new Date();

    // Daily (last 30 days)
    const daily: RetentionAnalysis["daily"] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      let activeUsers = 0;
      let newUsers = 0;

      const entries = Array.from(userActivityDates.entries());
      for (const [, entry] of entries) {
        if (entry.dates.has(dateStr)) activeUsers++;
        if (entry.createdAt.toISOString().split("T")[0] === dateStr) newUsers++;
      }

      daily.push({ date: dateStr, activeUsers, newUsers, returningUsers: activeUsers - newUsers });
    }

    // Weekly (last 12 weeks)
    const weekly: RetentionAnalysis["weekly"] = [];
    for (let i = 11; i >= 0; i--) {
      const endDate = new Date(now);
      endDate.setDate(endDate.getDate() - i * 7);
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 7);
      const lastWeekStart = new Date(startDate);
      lastWeekStart.setDate(lastWeekStart.getDate() - 7);

      const weekLabel = `${startDate.toISOString().split("T")[0]} - ${endDate.toISOString().split("T")[0]}`;
      const s = startDate.toISOString().split("T")[0];
      const e = endDate.toISOString().split("T")[0];
      const lws = lastWeekStart.toISOString().split("T")[0];

      let activeThis = 0;
      let activeLast = 0;
      let retained = 0;

      const entries = Array.from(userActivityDates.entries());
      for (const [, entry] of entries) {
        const datesArr = Array.from(entry.dates);
        const inThis = datesArr.some((d: string) => d >= s && d < e);
        const inLast = datesArr.some((d: string) => d >= lws && d < s);
        if (inThis) activeThis++;
        if (inLast) activeLast++;
        if (inLast && inThis) retained++;
      }

      weekly.push({
        week: weekLabel,
        activeUsers: activeThis,
        retained,
        retentionRate: activeLast > 0 ? Math.round((retained / activeLast) * 100) : 0,
      });
    }

    // Monthly (last 12 months)
    const monthly: RetentionAnalysis["monthly"] = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = date.toISOString().split("T")[0].slice(0, 7);
      const nextMonthStr = new Date(date.getFullYear(), date.getMonth() + 1, 1).toISOString().split("T")[0];

      let activeUsers = 0;
      const entries = Array.from(userActivityDates.entries());
      for (const [, entry] of entries) {
        const datesArr = Array.from(entry.dates);
        if (datesArr.some((d: string) => d >= monthStr && d < nextMonthStr)) {
          activeUsers++;
        }
      }

      monthly.push({ month: monthStr, totalUsers: users.length, activeUsers });
    }

    return { daily, weekly, monthly };
  } catch (error) {
    logger.error("[Retention Analysis] Error:", error);
    return { daily: [], weekly: [], monthly: [] };
  }
}

/**
 * Churn analysis.
 */
export async function analyzeChurn(): Promise<ChurnAnalysis> {
  try {
    const users: any[] = await prisma.user.findMany({
      select: { id: true, createdAt: true },
    });

    const commentDates: any[] = await prisma.comment.findMany({
      select: { userId: true, createdAt: true },
      where: { userId: { not: null } },
      orderBy: { createdAt: "desc" },
    });

    if (users.length === 0) {
      return { churnedUsers: 0, atRiskUsers: 0, churnRate: 0, avgLifespanDays: 0 };
    }

    const userLastComment = new Map();
    for (const c of commentDates) {
      if (c.userId && !userLastComment.has(c.userId)) {
        userLastComment.set(c.userId, c.createdAt);
      }
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    let churnedCount = 0;
    let atRiskCount = 0;
    let totalLifespan = 0;
    let lifespanCount = 0;

    for (const u of users) {
      const lastCommentDate = userLastComment.get(u.id);
      if (!lastCommentDate || lastCommentDate < thirtyDaysAgo) {
        churnedCount++;
      } else if (lastCommentDate >= thirtyDaysAgo && lastCommentDate < sevenDaysAgo) {
        atRiskCount++;
      }
      if (lastCommentDate) {
        totalLifespan += (lastCommentDate.getTime() - new Date(u.createdAt).getTime()) / (1000 * 60 * 60 * 24);
        lifespanCount++;
      }
    }

    return {
      churnedUsers: churnedCount,
      atRiskUsers: atRiskCount,
      churnRate: users.length > 0 ? Math.round((churnedCount / users.length) * 100) : 0,
      avgLifespanDays: lifespanCount > 0 ? Math.round(totalLifespan / lifespanCount) : 0,
    };
  } catch (error) {
    logger.error("[Churn Analysis] Error:", error);
    return { churnedUsers: 0, atRiskUsers: 0, churnRate: 0, avgLifespanDays: 0 };
  }
}

/**
 * Cohort analysis.
 */
export async function analyzeCohorts(): Promise<CohortAnalysis> {
  try {
    const users: any[] = await prisma.user.findMany({
      select: { id: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });
    const commentDates: any[] = await prisma.comment.findMany({
      select: { userId: true, createdAt: true },
      where: { userId: { not: null } },
    });

    if (users.length === 0) {
      return { cohorts: [], periods: [] };
    }

    // Build user -> activity week-keys
    const userActivityWeeks = new Map();
    for (const u of users) {
      userActivityWeeks.set(u.id, new Set());
    }
    for (const c of commentDates) {
      if (c.userId) {
        const wk = getWeekStart(new Date(c.createdAt)).toISOString().split("T")[0];
        const weeks = userActivityWeeks.get(c.userId);
        if (weeks) weeks.add(wk);
      }
    }

    // Group by signup week
    const cohortMap = new Map();
    for (const u of users) {
      const key = getWeekStart(new Date(u.createdAt)).toISOString().split("T")[0];
      if (!cohortMap.has(key)) cohortMap.set(key, []);
      cohortMap.get(key).push(u);
    }

    const cohorts = Array.from(cohortMap.entries())
      .sort(([a]: [string], [b]: [string]) => a.localeCompare(b))
      .slice(-12);

    const periods: string[] = [];
    for (let i = 0; i < 8; i++) periods.push(`Week ${i}`);

    const result = cohorts.map(([cohort, cohortUsers]: [string, any[]]) => {
      const cohortWeekStart = new Date(cohort + "T00:00:00Z");
      const retention: number[] = [];

      for (let week = 0; week < 8; week++) {
        const weekStart = new Date(cohortWeekStart);
        weekStart.setDate(weekStart.getDate() + week * 7);
        const weekKey = weekStart.toISOString().split("T")[0];
        let active = 0;

        for (const u of cohortUsers) {
          const weeks = userActivityWeeks.get(u.id);
          if (weeks && weeks.has(weekKey)) active++;
        }

        retention.push(cohortUsers.length > 0 ? Math.round((active / cohortUsers.length) * 100) : 0);
      }

      return { cohort, size: cohortUsers.length, retention };
    });

    return { cohorts: result, periods };
  } catch (error) {
    logger.error("[Cohort Analysis] Error:", error);
    return { cohorts: [], periods: [] };
  }
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
  d.setUTCDate(diff);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

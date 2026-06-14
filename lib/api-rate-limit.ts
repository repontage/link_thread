import { auth } from '@/auth';

interface ApiRateLimitTracker {
  count: number;
  resetTime: number;
}

const apiTrackers = new Map<string, ApiRateLimitTracker>();

/**
 * Session-based API rate limiter for the Public API.
 * Pro users: 10,000 requests/day
 * Free users: 100 requests/day
 * Anonymous: 50 requests/day
 */
export async function apiRateLimit(userId: string | undefined, isPro: boolean): Promise<boolean> {
  const key = userId || 'anonymous';
  const now = Date.now();
  const tracker = apiTrackers.get(key);

  // Daily limit (24 hours)
  const windowMs = 24 * 60 * 60 * 1000;

  let limit: number;
  if (!userId) {
    limit = 50; // Anonymous
  } else if (isPro) {
    limit = 10000; // Pro
  } else {
    limit = 100; // Free
  }

  if (!tracker || now > tracker.resetTime) {
    apiTrackers.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (tracker.count >= limit) {
    return false;
  }

  tracker.count += 1;
  return true;
}

/**
 * Check API rate limit and return appropriate error response or null if allowed.
 */
export async function checkApiRateLimit(_request: Request): Promise<{ allowed: boolean; error?: Response }> {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id;
    const isPro = (session?.user as any)?.isPro || false;

    const allowed = await apiRateLimit(userId, isPro);
    if (!allowed) {
      const retryAfter = isPro ? 3600 : 86400;
      return {
        allowed: false,
        error: new Response(
          JSON.stringify({
            error: 'API rate limit exceeded',
            message: isPro
              ? 'Pro plan limit reached (10,000/day). Please try again later.'
              : 'Free plan limit reached (100/day). Upgrade to Pro for 10,000 requests/day.',
            retryAfter,
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': String(retryAfter),
            },
          }
        ),
      };
    }

    return { allowed: true };
  } catch {
    // If auth fails, treat as anonymous
    const allowed = await apiRateLimit(undefined, false);
    if (!allowed) {
      return {
        allowed: false,
        error: new Response(
          JSON.stringify({ error: 'API rate limit exceeded' }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        ),
      };
    }
    return { allowed: true };
  }
}

/**
 * Clean up old rate limit trackers periodically
 */
export function cleanupApiRateLimitTrackers(): void {
  const now = Date.now();
  for (const [key, tracker] of apiTrackers.entries()) {
    if (now > tracker.resetTime + 24 * 60 * 60 * 1000) {
      apiTrackers.delete(key);
    }
  }
}

// Run cleanup every hour
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupApiRateLimitTrackers, 60 * 60 * 1000);
}

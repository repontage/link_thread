interface RateLimitTracker {
  count: number;
  resetTime: number;
}

const trackers = new Map<string, RateLimitTracker>();

export function rateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const tracker = trackers.get(ip);

  if (!tracker) {
    trackers.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (now > tracker.resetTime) {
    trackers.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (tracker.count >= limit) {
    return false;
  }

  tracker.count += 1;
  return true;
}

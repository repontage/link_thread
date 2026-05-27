import { unstable_cache } from "next/cache";
import { logger } from "./logger";

/**
 * Memory-based cache implementation for fast server-side caching
 * where Next.js data cache / fetch cache is not preferred.
 */
class SimpleMemoryCache {
  private cache = new Map<string, { value: any; expiresAt: number }>();

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      logger.debug(`[MemoryCache] Key "${key}" expired.`);
      return null;
    }

    logger.debug(`[MemoryCache] Hit for key "${key}".`);
    return item.value as T;
  }

  set<T>(key: string, value: T, ttlSeconds: number): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { value, expiresAt });
    logger.debug(`[MemoryCache] Set key "${key}" with TTL ${ttlSeconds}s.`);
  }

  delete(key: string): void {
    this.cache.delete(key);
    logger.debug(`[MemoryCache] Deleted key "${key}".`);
  }

  clear(): void {
    this.cache.clear();
    logger.debug("[MemoryCache] Cache cleared.");
  }
}

export const memoryCache = new SimpleMemoryCache();

/**
 * A wrapper around Next.js unstable_cache to cache database queries
 * with specific validation tags and duration.
 *
 * @param fn The database query function to cache
 * @param keys Unique query keys to identify the cached value
 * @param revalidateSeconds The cache lifetime in seconds
 * @param tags Validation tags for on-demand revalidation
 */
export function cachePrismaQuery<T extends (..._args: any[]) => Promise<any>>(
  fn: T,
  keys: string[],
  revalidateSeconds: number = 300, // default 5 minutes
  tags: string[] = []
): T {
  logger.info(`[PrismaCache] Registering cached query with keys: [${keys.join(", ")}], TTL: ${revalidateSeconds}s`);
  return unstable_cache(fn, keys, {
    revalidate: revalidateSeconds,
    tags: tags,
  }) as unknown as T;
}

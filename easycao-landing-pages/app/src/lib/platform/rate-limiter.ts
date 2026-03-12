/**
 * Simple in-memory rate limiter for serverless functions.
 * Note: In Vercel serverless, state is per-instance and ephemeral.
 * For production, consider Vercel KV or Upstash Redis.
 */

const windowMs = 60_000; // 1 minute
const maxRequests = 50;

const requestMap = new Map<string, number[]>();

/**
 * Check if a user has exceeded the rate limit.
 * @returns true if the request is allowed, false if rate-limited.
 */
export function checkRateLimit(uid: string): boolean {
  const now = Date.now();
  const timestamps = requestMap.get(uid) || [];

  // Remove expired timestamps
  const valid = timestamps.filter((t) => now - t < windowMs);

  if (valid.length >= maxRequests) {
    requestMap.set(uid, valid);
    return false;
  }

  valid.push(now);
  requestMap.set(uid, valid);
  return true;
}

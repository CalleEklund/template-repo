/**
 * @param attempt - The current attempt number, starting from 0.
 * @returns the delay in milliseconds to wait before retrying.
 *
 * Apply exponential backoff with full jitter before retrying the message.
 *
 * The formula is:
 *   delay = random(0, min(cap, base * 2^attempt))
 *
 * This helps:
 * - Avoid retry storms (due to randomness)
 * - Give the failing service time to recover
 * - Prevent overloading downstream systems
 *
 * Retry delays per attempt (approximate max values):
 *   Attempt 1 → 0–20s
 *   Attempt 2 → 0–40s
 *   Attempt 3 → 0–80s
 *   Attempt 4 → 0–160s
 *   Attempt 5 → 0–300s (capped)
 *
 */
export const calculateExponentialBackoffDelay = (attempt: number): number => {
  const base = 10_000;
  const cap = 300_000; // 5 minutes
  const exponential = Math.min(cap, base * Math.pow(2, attempt));
  const delay = Math.floor(Math.random() * exponential);
  return delay;
};

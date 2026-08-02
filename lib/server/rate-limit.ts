type Entry = { count: number; resetAt: number };

const requests = new Map<string, Entry>();

export function isRateLimited(
  key: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {},
) {
  const now = Date.now();
  const current = requests.get(key);

  if (!current || current.resetAt <= now) {
    requests.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  current.count += 1;
  return current.count > limit;
}

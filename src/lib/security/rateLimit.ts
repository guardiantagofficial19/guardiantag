import { sql } from '@/lib/db';

// Login lockouts and rate limits live in Neon (tag_auth_locks / rate_limits, see
// db/2026-11-20-auth-state.sql) so they hold across serverless instances and restarts.

export interface LockoutStatus {
  isLocked: boolean;
  remainingMinutes?: number;
  attemptsCount: number;
}

/** Per (tag, IP): 3 failures within 15 min lock that IP out of that tag for 5 min. */
const IP_MAX_FAILED = 3;
const IP_WINDOW = '15 minutes';
const IP_LOCK = '5 minutes';
/** Per tag across all IPs: 20 failures within 1 hour lock the tag for 30 min (stops IP rotation). */
const TAG_MAX_FAILED = 20;
const TAG_WINDOW = '1 hour';
const TAG_LOCK = '30 minutes';
const ALL_IPS = '*';

const cleanIp = (ip: string) => (ip || 'unknown').slice(0, 100);

/** Is this tag locked for this IP (or for everyone)? */
export async function checkLockoutStatus(qrId: string, ip: string): Promise<LockoutStatus> {
  const rows = await sql`
    SELECT failed_attempts,
           CEIL(EXTRACT(EPOCH FROM (locked_until - now())) / 60)::int AS mins
    FROM tag_auth_locks
    WHERE qr_id = ${qrId} AND ip_address IN (${cleanIp(ip)}, ${ALL_IPS}) AND locked_until > now()
    ORDER BY locked_until DESC LIMIT 1`;
  if (rows.length === 0) return { isLocked: false, attemptsCount: 0 };
  return { isLocked: true, remainingMinutes: Math.max(1, Number(rows[0].mins)), attemptsCount: Number(rows[0].failed_attempts) };
}

function upsertFailure(qrId: string, ip: string, max: number, windowLen: string, lockLen: string) {
  // The counter restarts when the window has passed or a previous lock has expired.
  const fresh = `(l.last_failed_at < now() - interval '${windowLen}' OR (l.locked_until IS NOT NULL AND l.locked_until <= now()))`;
  return sql.query(
    `INSERT INTO tag_auth_locks AS l (qr_id, ip_address, failed_attempts, last_failed_at, locked_until)
     VALUES ($1::text, $2::text, 1, now(), CASE WHEN 1 >= $3::int THEN now() + interval '${lockLen}' END)
     ON CONFLICT (qr_id, ip_address) DO UPDATE SET
       failed_attempts = CASE WHEN ${fresh} THEN 1 ELSE l.failed_attempts + 1 END,
       locked_until = CASE WHEN (CASE WHEN ${fresh} THEN 1 ELSE l.failed_attempts + 1 END) >= $3::int
                           THEN now() + interval '${lockLen}' ELSE NULL END,
       last_failed_at = now()
     RETURNING failed_attempts, locked_until > now() AS locked`,
    [qrId, ip, max]
  );
}

/** Records a failed PIN/OTP attempt and returns the lock state for this IP. */
export async function recordFailedAttempt(qrId: string, ip: string): Promise<LockoutStatus> {
  const [perIp, perTag] = await sql.transaction([
    upsertFailure(qrId, cleanIp(ip), IP_MAX_FAILED, IP_WINDOW, IP_LOCK),
    upsertFailure(qrId, ALL_IPS, TAG_MAX_FAILED, TAG_WINDOW, TAG_LOCK),
  ]);
  const ipRow = (perIp as Record<string, unknown>[])[0];
  const tagRow = (perTag as Record<string, unknown>[])[0];
  if (tagRow?.locked) return { isLocked: true, remainingMinutes: 30, attemptsCount: Number(tagRow.failed_attempts) };
  if (ipRow?.locked) return { isLocked: true, remainingMinutes: 5, attemptsCount: Number(ipRow.failed_attempts) };
  return { isLocked: false, attemptsCount: Number(ipRow?.failed_attempts) || 0 };
}

/** Clears this IP's failure count after a successful login (the all-IP counter just expires). */
export async function resetAttempts(qrId: string, ip: string): Promise<void> {
  await sql`DELETE FROM tag_auth_locks WHERE qr_id = ${qrId} AND ip_address = ${cleanIp(ip)}`;
}

/**
 * Fixed-window counter. Returns true when `bucket` has gone over `limit` hits in the current window.
 */
export async function isRateLimited(bucket: string, limit: number, windowSeconds: number): Promise<boolean> {
  const rows = await sql`
    INSERT INTO rate_limits AS r (bucket, hits, reset_at)
    VALUES (${bucket}, 1, now() + make_interval(secs => ${windowSeconds}::int))
    ON CONFLICT (bucket) DO UPDATE SET
      hits = CASE WHEN r.reset_at <= now() THEN 1 ELSE r.hits + 1 END,
      reset_at = CASE WHEN r.reset_at <= now() THEN EXCLUDED.reset_at ELSE r.reset_at END
    RETURNING hits`;
  if (Math.random() < 0.02) await sql`DELETE FROM rate_limits WHERE reset_at < now() - interval '1 day'`;
  return Number(rows[0]?.hits) > limit;
}

/** True if `bucket` already has `limit` or more hits in its current window (does not count a hit). */
export async function isOverLimit(bucket: string, limit: number): Promise<boolean> {
  const rows = await sql`SELECT hits FROM rate_limits WHERE bucket = ${bucket} AND reset_at > now()`;
  return Number(rows[0]?.hits) >= limit;
}

/** Forgets a bucket (e.g. after a successful login). */
export async function clearRateLimit(bucket: string): Promise<void> {
  await sql`DELETE FROM rate_limits WHERE bucket = ${bucket}`;
}

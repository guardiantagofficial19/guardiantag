import crypto from 'crypto';
import { sql } from '@/lib/db';

// One-time codes live in the owner_otps table (db/2026-11-20-auth-state.sql) so that any
// server instance can verify a code another instance issued.

const MAX_ATTEMPTS = 5;

/** Keyed hash so a leaked table cannot be brute-forced back to codes without the server secret. */
function digest(key: string, code: string): string {
  const secret = process.env.OWNER_SESSION_SECRET || '';
  return crypto.createHmac('sha256', secret).update(`${key}:${code}`).digest('hex');
}

/** Issues a fresh 6-digit code for `key` (5 min validity), or reports how long to wait (30 s cooldown). */
export async function issueOtp(key: string): Promise<{ code: string } | { retryAfterSec: number }> {
  const code = String(crypto.randomInt(100000, 1000000));
  const rows = await sql`
    INSERT INTO owner_otps (otp_key, code_hash, expires_at, issued_at, attempts)
    VALUES (${key}, ${digest(key, code)}, now() + interval '5 minutes', now(), 0)
    ON CONFLICT (otp_key) DO UPDATE SET
      code_hash = EXCLUDED.code_hash, expires_at = EXCLUDED.expires_at, issued_at = now(), attempts = 0
    WHERE owner_otps.issued_at < now() - interval '30 seconds'
    RETURNING otp_key`;

  if (rows.length === 0) {
    const wait = await sql`
      SELECT GREATEST(1, CEIL(EXTRACT(EPOCH FROM (issued_at + interval '30 seconds' - now()))))::int AS s
      FROM owner_otps WHERE otp_key = ${key}`;
    return { retryAfterSec: Number(wait[0]?.s) || 30 };
  }

  // Opportunistic cleanup of long-dead codes.
  if (Math.random() < 0.05) await sql`DELETE FROM owner_otps WHERE expires_at < now() - interval '1 day'`;
  return { code };
}

/** Checks a code. A correct code is consumed; after 5 wrong tries the code is voided. */
export async function verifyOtp(key: string, code: unknown): Promise<'ok' | 'invalid' | 'expired' | 'missing'> {
  const given = typeof code === 'string' ? code.trim() : '';

  if (/^\d{6}$/.test(given)) {
    const consumed = await sql`
      DELETE FROM owner_otps
      WHERE otp_key = ${key} AND code_hash = ${digest(key, given)} AND expires_at > now() AND attempts < ${MAX_ATTEMPTS}
      RETURNING otp_key`;
    if (consumed.length > 0) return 'ok';
  }

  const rows = await sql`
    UPDATE owner_otps SET attempts = attempts + 1 WHERE otp_key = ${key}
    RETURNING (expires_at > now()) AS live, attempts`;
  if (rows.length === 0) return 'missing';
  if (!rows[0].live) {
    await sql`DELETE FROM owner_otps WHERE otp_key = ${key}`;
    return 'expired';
  }
  if (Number(rows[0].attempts) >= MAX_ATTEMPTS) {
    await sql`DELETE FROM owner_otps WHERE otp_key = ${key}`;
  }
  return 'invalid';
}

/** Sends an SMS through Twilio if credentials are configured. Returns false if not sent. */
export async function sendSms(to: string, body: string): Promise<boolean> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_PROXY_NUMBER;
  if (!accountSid || !authToken || !from) return false;
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ To: to, From: from, Body: body }).toString(),
  });
  return res.ok;
}

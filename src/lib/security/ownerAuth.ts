import crypto from 'crypto';

export const OWNER_COOKIE = 'gt_owner_session';

// No built-in fallback: owner sessions need their own OWNER_SESSION_SECRET.
function ownerSecret(): string {
  const s = process.env.OWNER_SESSION_SECRET;
  if (!s || s.length < 32) throw new Error('OWNER_SESSION_SECRET is not set (min 32 chars).');
  return s;
}

export interface OwnerSessionPayload {
  qrId: string;
  ownerId?: string;
  exp: number;
}

function hmacSignature(data: string, secret: string = ownerSecret()): string {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

/**
 * Creates an HMAC-SHA256 signed, tamper-proof session token for a verified tag owner.
 */
export function createOwnerToken(qrId: string, ownerId?: string): string {
  const cleanId = qrId.trim().toUpperCase();
  const exp = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const payload: OwnerSessionPayload = {
    qrId: cleanId,
    ownerId: ownerId || '',
    exp,
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = hmacSignature(payloadStr);
  return `${payloadStr}.${sig}`;
}

/**
 * Verifies the HMAC-SHA256 signature and expiration of an owner session token.
 * Optionally validates that the session belongs to a specific expected QR ID.
 */
export function verifyOwnerToken(token?: string, expectedQrId?: string): OwnerSessionPayload | null {
  if (!token || typeof token !== 'string' || (process.env.OWNER_SESSION_SECRET || '').length < 32) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadStr, sig] = parts;
  const expectedSig = hmacSignature(payloadStr);

  const sigBuf = Buffer.from(sig, 'hex');
  const expectedBuf = Buffer.from(expectedSig, 'hex');

  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const json = Buffer.from(payloadStr, 'base64url').toString('utf-8');
    const data: OwnerSessionPayload = JSON.parse(json);

    if (!data.qrId || !data.exp || data.exp < Date.now()) {
      return null;
    }

    if (expectedQrId && data.qrId.toUpperCase() !== expectedQrId.trim().toUpperCase()) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

/* ---------- Verified-phone proof (registration) ---------- */

export const PHONE_PROOF_COOKIE = 'gt_phone_verified';
export const PHONE_PROOF_MAX_AGE = 30 * 60; // seconds

/** Signed proof that `phone` (E.164) passed OTP verification. Domain-separated from session tokens. */
export function createPhoneProof(phone: string): string {
  const exp = Date.now() + PHONE_PROOF_MAX_AGE * 1000;
  const payload = `${phone}|${exp}`;
  return `${Buffer.from(payload).toString('base64url')}.${hmacSignature(`phone-proof:${payload}`)}`;
}

/** True if `token` is an unexpired proof for exactly this phone number. */
export function verifyPhoneProof(token: string | undefined, phone: string): boolean {
  if (!token || (process.env.OWNER_SESSION_SECRET || '').length < 32) return false;
  const [b64, sig] = token.split('.');
  if (!b64 || !sig) return false;
  const payload = Buffer.from(b64, 'base64url').toString('utf-8');
  const expected = Buffer.from(hmacSignature(`phone-proof:${payload}`), 'hex');
  const given = Buffer.from(sig, 'hex');
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return false;
  const [p, exp] = payload.split('|');
  return p === phone && Number(exp) > Date.now();
}

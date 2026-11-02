import crypto from 'crypto';

export const OWNER_COOKIE = 'gt_owner_session';

const DEFAULT_SECRET =
  process.env.OWNER_SESSION_SECRET ||
  process.env.ADMIN_SESSION_SECRET ||
  'gt_owner_secret_secure_key_fallback_2026_x89';

export interface OwnerSessionPayload {
  qrId: string;
  ownerId?: string;
  exp: number;
}

function hmacSignature(data: string, secret: string = DEFAULT_SECRET): string {
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
  if (!token || typeof token !== 'string') return null;
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

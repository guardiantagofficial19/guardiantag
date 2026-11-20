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

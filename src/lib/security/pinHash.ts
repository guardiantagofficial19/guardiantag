import crypto from 'crypto';

/**
 * Server-side secure PIN hashing using PBKDF2 with SHA-512 and random salt.
 * Ensures plain-text PINs are never stored or exposed.
 */
export function hashPin(pin: string): { hash: string; salt: string } {
  if (!/^\d{4}$/.test(pin)) {
    throw new Error('PIN must be exactly 4 digits.');
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(pin, salt, 100000, 64, 'sha512')
    .toString('hex');

  return { hash, salt };
}

/**
 * Server-side PIN verification helper.
 */
export function verifyPin(pin: string, storedHash: string, storedSalt: string): boolean {
  if (!pin || !storedHash || !storedSalt) return false;

  const hashToVerify = crypto
    .pbkdf2Sync(pin, storedSalt, 100000, 64, 'sha512')
    .toString('hex');

  return crypto.timingSafeEqual(Buffer.from(storedHash), Buffer.from(hashToVerify));
}

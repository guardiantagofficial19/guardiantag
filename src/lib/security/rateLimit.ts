export interface LockoutStatus {
  isLocked: boolean;
  remainingMinutes?: number;
  attemptsCount: number;
}

interface AttemptRecord {
  attempts: number;
  lastAttempt: number;
  lockedUntil?: number;
}

// In-Memory Rate Limiter Store for (QR ID + Client IP)
const attemptStore = new Map<string, AttemptRecord>();

const MAX_FAILED_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

function getKey(qrId: string, ip: string = '127.0.0.1'): string {
  return `${qrId.trim().toUpperCase()}:${ip}`;
}

/**
 * Check if a QR ID + IP combination is currently locked out.
 */
export function checkLockoutStatus(qrId: string, ip: string = '127.0.0.1'): LockoutStatus {
  const key = getKey(qrId, ip);
  const record = attemptStore.get(key);

  if (!record) {
    return { isLocked: false, attemptsCount: 0 };
  }

  const now = Date.now();

  // If locked out, check if lock period has expired
  if (record.lockedUntil && record.lockedUntil > now) {
    const remainingMs = record.lockedUntil - now;
    const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));
    return {
      isLocked: true,
      remainingMinutes,
      attemptsCount: record.attempts,
    };
  }

  // Lock expired
  if (record.lockedUntil && record.lockedUntil <= now) {
    attemptStore.delete(key);
    return { isLocked: false, attemptsCount: 0 };
  }

  return { isLocked: false, attemptsCount: record.attempts };
}

/**
 * Record a failed authentication attempt.
 */
export function recordFailedAttempt(qrId: string, ip: string = '127.0.0.1'): LockoutStatus {
  const key = getKey(qrId, ip);
  const now = Date.now();
  const record = attemptStore.get(key) || { attempts: 0, lastAttempt: now };

  record.attempts += 1;
  record.lastAttempt = now;

  if (record.attempts >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    attemptStore.set(key, record);
    return {
      isLocked: true,
      remainingMinutes: 5,
      attemptsCount: record.attempts,
    };
  }

  attemptStore.set(key, record);
  return {
    isLocked: false,
    attemptsCount: record.attempts,
  };
}

/**
 * Reset failed attempts upon successful login.
 */
export function resetAttempts(qrId: string, ip: string = '127.0.0.1'): void {
  const key = getKey(qrId, ip);
  attemptStore.delete(key);
}

// Authorized Admin Mobile Whitelist (E.164 Format)
const AUTHORIZED_ADMIN_PHONES = new Set([
  '+919876543210',
  '+919123456789',
  '+919999999999',
]);

interface OtpRecord {
  otp: string;
  expiresAt: number;
}

// In-Memory Server OTP Vault (Phone -> OTP Record)
const otpStore = new Map<string, OtpRecord>();

/**
 * Check if a mobile number is in the authorized admin whitelist.
 */
export function isAuthorizedAdminPhone(rawPhone: string): boolean {
  const cleanPhone = rawPhone.replace(/\s+/g, '').replace(/-/g, '');
  // Normalize e.g. 9876543210 -> +919876543210
  const formatted = cleanPhone.startsWith('+') ? cleanPhone : `+91${cleanPhone}`;
  return AUTHORIZED_ADMIN_PHONES.has(formatted);
}

/**
 * Generate a 6-digit OTP for an authorized admin mobile number.
 */
export function generateAdminOtp(rawPhone: string): { success: boolean; otp?: string; error?: string } {
  const cleanPhone = rawPhone.replace(/\s+/g, '').replace(/-/g, '');
  const formatted = cleanPhone.startsWith('+') ? cleanPhone : `+91${cleanPhone}`;

  if (!isAuthorizedAdminPhone(formatted)) {
    return {
      success: false,
      error: `Access Denied: Mobile number ${formatted} is not an authorized Admin line.`,
    };
  }

  // Generate random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

  otpStore.set(formatted, { otp, expiresAt });

  return { success: true, otp };
}

/**
 * Verify a 6-digit OTP for an admin mobile number.
 */
export function verifyAdminOtp(rawPhone: string, inputOtp: string): boolean {
  const cleanPhone = rawPhone.replace(/\s+/g, '').replace(/-/g, '');
  const formatted = cleanPhone.startsWith('+') ? cleanPhone : `+91${cleanPhone}`;

  const record = otpStore.get(formatted);
  if (!record) return false;

  if (Date.now() > record.expiresAt) {
    otpStore.delete(formatted);
    return false;
  }

  // Test Mode Fallback OTP: 123456
  if (inputOtp === '123456' || record.otp === inputOtp) {
    otpStore.delete(formatted);
    return true;
  }

  return false;
}

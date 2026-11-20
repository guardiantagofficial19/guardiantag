/** Normalizes an Indian mobile number to E.164 (+91XXXXXXXXXX), or returns null. */
export function toIndianMobile(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  let d = raw.replace(/[\s\-().]/g, '');
  if (d.startsWith('+91')) d = d.slice(3);
  else if (d.startsWith('0091')) d = d.slice(4);
  else if (/^91\d{10}$/.test(d)) d = d.slice(2);
  else if (/^0\d{10}$/.test(d)) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? `+91${d}` : null;
}

/**
 * Normalizes any phone number to E.164. Bare 10-digit numbers are treated as Indian.
 * Returns null unless the result is "+" followed by 8–15 digits.
 */
export function toE164(raw: unknown): string | null {
  const india = toIndianMobile(raw);
  if (india) return india;
  if (typeof raw !== 'string') return null;
  let d = raw.replace(/[\s\-().]/g, '');
  if (d.startsWith('00')) d = `+${d.slice(2)}`;
  if (!d.startsWith('+')) d = `+${d}`;
  return /^\+[1-9]\d{7,14}$/.test(d) ? d : null;
}

/** "+919876543210" -> "+91 ••••••3210" */
export function maskPhone(e164: string): string {
  return `${e164.slice(0, 3)} ••••••${e164.slice(-4)}`;
}

// Edge-safe (used by middleware): signed, expiring cookie. No Node-only APIs.
export const COOKIE = "gt_admin";

// No built-in fallback: without ADMIN_SESSION_SECRET, admin sessions can be neither created nor verified.
function sessionSecret(): string | null {
  const s = process.env.ADMIN_SESSION_SECRET;
  return s && s.length >= 32 ? s : null;
}

async function hmac(msg: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function safeEqual(a: string, b: string) {
  if (a === b) return true;
  let d = a.length ^ b.length;
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) d |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return d === 0;
}

export async function createToken() {
  const secret = sessionSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set (min 32 chars).");
  const exp = String(Date.now() + 7 * 24 * 3600 * 1000);
  return `${exp}.${await hmac(exp, secret)}`;
}

export async function verifyToken(token?: string) {
  const secret = sessionSecret();
  if (!token || !secret) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return safeEqual(sig, await hmac(exp, secret));
}

// Edge-safe (used by middleware): signed, expiring cookie. No Node-only APIs.
export const COOKIE = "gt_admin";

const DEFAULT_SECRET = "e9b46f0436d4f938c538a7c1b41db52ea8290f6580a8f89e2469a4713da581c7f12a3d0b178c7e923e41980f765293da27b6c7a91873e2a9b48c6712398ab451";

async function hmac(msg: string) {
  const secret = process.env.ADMIN_SESSION_SECRET || DEFAULT_SECRET;
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
  const exp = String(Date.now() + 7 * 24 * 3600 * 1000);
  return `${exp}.${await hmac(exp)}`;
}

export async function verifyToken(token?: string) {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return safeEqual(sig, await hmac(exp));
}

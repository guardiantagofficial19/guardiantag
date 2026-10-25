// URL encoded into each printed QR. Must match the real scan route: /tag/[id].
// Override with TAG_URL_TEMPLATE (use {qr_id} as the placeholder) if your domain changes.
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://guardiantag-opal.vercel.app";

export const tagUrl = (qrId: string) =>
  (process.env.TAG_URL_TEMPLATE ?? `${SITE}/tag/{qr_id}`).replace("{qr_id}", encodeURIComponent(qrId));

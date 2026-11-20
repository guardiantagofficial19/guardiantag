// URL encoded into each printed QR. Must match the real scan route: /tag/[id].
// Override with TAG_URL_TEMPLATE (use {qr_id} as the placeholder) if your domain changes.
import { SITE_URL as SITE } from "./site";

export const tagUrl = (qrId: string) =>
  (process.env.TAG_URL_TEMPLATE ?? `${SITE}/tag/{qr_id}`).replace("{qr_id}", encodeURIComponent(qrId));

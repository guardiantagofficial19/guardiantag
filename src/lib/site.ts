/** Public base URL of the site (no trailing slash). Set NEXT_PUBLIC_SITE_URL when the domain changes. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://guardiantag-opal.vercel.app').replace(/\/+$/, '');

export const SITE_NAME = 'GuardianTag';
export const SITE_TITLE = 'GuardianTag | Emergency QR Safety Tags for Bikers';
export const SITE_DESCRIPTION =
  'Biker emergency QR safety tags for helmets and motorcycles with ₹499 one-time pricing and no subscriptions. Instant emergency calling with complete phone number privacy. Kids, luggage, and pet tags coming soon.';

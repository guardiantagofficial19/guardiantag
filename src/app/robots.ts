import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Admin, APIs, owner dashboard and individual tag scan pages are not for search engines.
      disallow: ['/admin', '/api/', '/manage', '/tag/', '/emergency'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

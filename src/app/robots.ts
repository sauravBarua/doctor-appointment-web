import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/site-url';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // '/doctor/' (with the slash) keeps the public /doctors pages crawlable.
      disallow: [
        '/api/',
        '/dashboard',
        '/appointments',
        '/notifications',
        '/profile',
        '/doctor/',
        '/admin',
        '/change-password',
        '/login',
        '/register',
        '/verify-email',
        '/auth/',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/site-url';

const PAGES = ['', '/doctors', '/specialties', '/clinics'];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === '' ? 'weekly' : 'daily',
  }));
}

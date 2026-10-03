import type { MetadataRoute } from 'next';
import { FALLACIES, fallacySlug } from './lib';
import { LAST_UPDATED, SITE_URL } from './site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: LAST_UPDATED, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/fallacies`, lastModified: LAST_UPDATED, changeFrequency: 'monthly', priority: 0.8 },
    ...FALLACIES.map((f) => ({
      url: `${SITE_URL}/fallacies/${fallacySlug(f)}`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}

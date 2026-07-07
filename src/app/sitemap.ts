import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';
import { siteUrl } from '@/lib/shared';

export const revalidate = false;

// Emits the home page plus every docs page, on the canonical origin.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const docs = source.getPages().map((page) => ({
    url: `${siteUrl}${page.url}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...docs,
  ];
}

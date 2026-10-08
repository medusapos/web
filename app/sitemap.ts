import type { MetadataRoute } from 'next';
import { pageLastModified } from '@/lib/page-dates';
import { siteConfig } from '@/lib/site';
import { source } from '@/lib/source';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: pageLastModified('app/(home)/page.tsx'),
    },
    ...source.getPages().map((page) => ({
      url: new URL(page.url, siteConfig.url).toString(),
      lastModified: pageLastModified(`content/docs/${page.path}`),
    })),
  ];
}

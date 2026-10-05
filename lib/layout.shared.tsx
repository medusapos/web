import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { siteConfig } from '@/lib/site';

export const gitConfig = siteConfig.docsRepo;

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: siteConfig.name,
    },
    githubUrl: siteConfig.githubUrl,
    links: [{ text: 'Docs', url: '/docs', active: 'nested-url' }],
  };
}

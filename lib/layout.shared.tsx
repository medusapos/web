import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { siteConfig } from '@/lib/site';

export const gitConfig = {
  user: 'medusapos',
  repo: 'app',
  branch: 'main',
};

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: siteConfig.name,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}

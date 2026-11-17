import { HomeLayout } from 'fumadocs-ui/layouts/home';
import Link from 'next/link';
import { baseOptions } from '@/lib/layout.shared';
import { siteConfig } from '@/lib/site';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <HomeLayout {...baseOptions()}>
      {children}
      <footer className="border-t border-fd-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-2 sm:flex-row sm:justify-between text-sm text-fd-muted-foreground">
          <p>
          Built with{' '}
          <a href={siteConfig.builtWith.url} className="inline-block py-2 underline sm:py-0">
            {siteConfig.builtWith.name}
          </a>
          . Running {siteConfig.sibling.platform}? See{'\u00a0'}
          <span className="whitespace-nowrap">
          <a href={siteConfig.sibling.url} className="inline-block py-2 underline sm:py-0">
            {siteConfig.sibling.name}
          </a>
          .
          </span>
          </p>
          <Link href="/docs/changelog" className="inline-block py-2 underline sm:py-0">
            Changelog
          </Link>
        </div>
      </footer>
    </HomeLayout>
  );
}

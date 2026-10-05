import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { siteConfig } from '@/lib/site';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <HomeLayout {...baseOptions()}>
      {children}
      <footer className="border-t border-fd-border">
        <p className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-sm text-fd-muted-foreground">
          Built with{' '}
          <a href={siteConfig.builtWith.url} className="underline">
            {siteConfig.builtWith.name}
          </a>
          . Running {siteConfig.sibling.platform}? See{' '}
          <a href={siteConfig.sibling.url} className="underline">
            {siteConfig.sibling.name}
          </a>
          .
        </p>
      </footer>
    </HomeLayout>
  );
}

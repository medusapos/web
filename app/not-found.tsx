import Link from 'next/link';
import type { Metadata } from 'next';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <HomeLayout {...baseOptions()}>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-fd-foreground">
        <p className="text-sm text-fd-muted-foreground">404</p>
        <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight">Page not found</h1>
        <p className="mt-6 text-lg text-fd-muted-foreground">
          There&apos;s nothing at this address. It may have moved, or the link may be mistyped.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/"
            className="rounded-lg px-5 py-2.5 font-medium bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/90"
          >
            Home
          </Link>
          <a
            href={siteConfig.demoUrl}
            className="rounded-lg px-5 py-2.5 font-medium border border-fd-border hover:bg-fd-accent"
          >
            Live demo
          </a>
          <Link
            href="/docs"
            className="rounded-lg px-5 py-2.5 font-medium border border-fd-border hover:bg-fd-accent"
          >
            Docs
          </Link>
        </div>
      </main>
    </HomeLayout>
  );
}

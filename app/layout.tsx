import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site';
import { Analytics } from '@/components/analytics';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  openGraph: { type: 'website', siteName: siteConfig.name, url: '/' },
  twitter: { card: 'summary_large_image' },
};

const inter = Inter({
  subsets: ['latin'],
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        {/* Search dialog loads on first open instead of during hydration, keeping it out of docs first load. */}
        <RootProvider search={{ preload: false }}>{children}</RootProvider>
        <Analytics />
      </body>
    </html>
  );
}

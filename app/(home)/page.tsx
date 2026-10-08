import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Banknote, Calculator, Coins, Pause, Pencil, Percent, ScanBarcode, Smartphone, Store, UserRound, WifiOff, type LucideIcon } from 'lucide-react';
import { features, type FeatureIcon } from '@/lib/features';
import { siteConfig } from '@/lib/site';
import { homeJsonLd, serializeJsonLd } from '@/lib/structured-data';

const icons: Record<FeatureIcon, LucideIcon> = {
  'wifi-off': WifiOff,
  store: Store,
  banknote: Banknote,
  coins: Coins,
  calculator: Calculator,
  'scan-barcode': ScanBarcode,
  smartphone: Smartphone,
  percent: Percent,
  pause: Pause,
  pencil: Pencil,
  'user-round': UserRound,
};

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 text-fd-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(homeJsonLd(siteConfig)) }}
      />
      <section className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-2">
        <div>
          <p className="mb-4 text-sm text-fd-muted-foreground">{`Beta · version ${siteConfig.release}`}</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Point of sale for Medusa</h1>
          <p className="mt-6 text-lg text-fd-muted-foreground">
            MedusaPOS is an open-source, MIT-licensed till for Medusa v2 stores. It runs in the browser, keeps selling when the connection drops, and records every sale in your Medusa store exactly once.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={siteConfig.demoUrl}
              className="rounded-lg px-5 py-2.5 font-medium bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/90"
            >
              Live demo
            </a>
            <a
              href={siteConfig.appUrl}
              className="rounded-lg px-5 py-2.5 font-medium border border-fd-border hover:bg-fd-accent"
            >
              Open the web app
            </a>
            <Link
              href="/docs/quick-start"
              className="rounded-lg px-5 py-2.5 font-medium border border-fd-border hover:bg-fd-accent"
            >
              Quick start
            </Link>
          </div>
          <p className="mt-4 text-sm text-fd-muted-foreground">
            The demo store resets every night. The web app needs a Medusa 2.21 store with the MedusaPOS plugin installed.
          </p>
        </div>
        <div className="rounded-xl border border-fd-border shadow-lg overflow-hidden">
          <Image
            src="/screenshots/sale-desktop.png"
            alt="MedusaPOS on a desktop browser: the product grid, a cart with VAT, and Cash and Card terminal buttons"
            width={1280}
            height={800}
            preload
            fetchPriority="high"
            sizes="(min-width: 1024px) 536px, 100vw"
            className="h-auto w-full"
          />
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">What it does today</h2>
        <p className="mt-4 text-fd-muted-foreground">
          Everything listed here is covered by the app's automated tests, which run on every change.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = icons[feature.icon];
            return (
              <div key={feature.title} className="rounded-xl border border-fd-border bg-fd-card p-6">
                <Icon size={20} className="text-fd-muted-foreground" />
                {!feature.released && <p className="mt-4 text-sm text-fd-muted-foreground">In the live demo · next release</p>}
                <h3 className={`${feature.released ? 'mt-4' : 'mt-1'} text-lg font-semibold`}>{feature.title}</h3>
                <p className="mt-2 text-fd-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{`Live demo and release ${siteConfig.release}`}</h2>
        <p className="mt-4 text-fd-muted-foreground">{`The live demo runs the app's latest build. Release ${siteConfig.release} is the version you install in your store today.`}</p>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">{`Features in the live demo and in release ${siteConfig.release}`}</caption>
            <thead>
              <tr>
                <th scope="col" className="py-2 pr-4 font-semibold">Feature</th>
                <th scope="col" className="py-2 pr-4 font-semibold">Live demo</th>
                <th scope="col" className="py-2 pr-4 font-semibold">{`Release ${siteConfig.release}`}</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature) => (
                <tr key={feature.title} className="border-t border-fd-border">
                  <th scope="row" className="py-2 pr-4 font-medium">{feature.title}</th>
                  <td className="py-2 pr-4 text-fd-muted-foreground">Yes</td>
                  <td className="py-2 text-fd-muted-foreground">{feature.released ? 'Yes' : 'Next release'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6"><a href={siteConfig.demoUrl} className="underline">Try the live demo</a>: one click signs you in to a demo store that resets every night.</p>
      </section>

      <section className="grid items-center gap-10 py-12 sm:py-16 md:grid-cols-[300px_1fr]">
        <div className="w-[300px] max-w-full rounded-xl border border-fd-border shadow-lg overflow-hidden">
          <Image
            src="/screenshots/sale-phone.png"
            alt="MedusaPOS on a phone: the product grid with stock badges and the cart bar"
            width={360}
            height={740}
            className="h-auto w-full"
          />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">In the browser you already have</h2>
          <p className="mt-4 text-fd-muted-foreground">
            Open app.medusapos.com in a current Chrome, Edge, Safari or Firefox and sign in with your store's backend URL and an admin account. The catalogue and unsent sales are kept in the browser's own storage, so a page reload or a dropped connection doesn't lose a sale.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Not there yet</h2>
        <p className="mt-4 text-fd-muted-foreground">MedusaPOS is in beta. Today it does not:</p>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-fd-muted-foreground">
          <li>charge cards, or handle refunds and returns</li>
          <li>sign in with multi-factor authentication</li>
          <li>run as a native iOS, Android or desktop app (it runs in the browser)</li>
          <li>support more than one stock location per sales channel</li>
        </ul>
        <p className="mt-4 text-fd-muted-foreground">
          See the <Link href="/docs/limitations" className="underline">limitations page</Link> for the full list.
        </p>
      </section>

      <section className="border-t border-fd-border py-12 sm:py-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Try it with your store</h2>
        <p className="mt-4 text-fd-muted-foreground">
          Install the plugin, allow the POS origin, and sign in. The quick start walks through it.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href={siteConfig.appUrl}
            className="rounded-lg px-5 py-2.5 font-medium bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/90"
          >
            Open the web app
          </a>
          <Link
            href="/docs/quick-start"
            className="rounded-lg px-5 py-2.5 font-medium border border-fd-border hover:bg-fd-accent"
          >
            Quick start
          </Link>
          <a href={siteConfig.githubUrl} className="underline">Source on GitHub</a>
        </div>
      </section>
    </main>
  );
}

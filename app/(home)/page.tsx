import Image, { getImageProps } from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Banknote, Calculator, Coins, PackagePlus, Pause, Pencil, Percent, ScanBarcode, Smartphone, Store, UserRound, WifiOff, type LucideIcon } from 'lucide-react';
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
  'package-plus': PackagePlus,
};

export const metadata: Metadata = {
  title: { absolute: 'MedusaPOS – open-source point of sale for Medusa v2' },
  alternates: { canonical: '/' },
};

export default function HomePage() {
  const allReleased = features.every((feature) => feature.released);
  // The first three cards in lib/features.ts are the core till jobs: the home page shows them as a larger first row.
  const core = features.slice(0, 3);
  const more = features.slice(3);
  // With an odd count (9 today), the last of the other cards spans both columns at two columns, so no card sits alone.
  const spanLast = more.length % 2 === 1;
  const heroAlt = 'MedusaPOS sale screen in the browser: the product grid with prices and stock, and a cart of four items with its total';
  const { props: heroDesktop } = getImageProps({
    src: '/screenshots/sale-desktop-1000.png',
    alt: heroAlt,
    width: 1000,
    height: 680,
    sizes: '(min-width: 1024px) 624px, 100vw',
  });
  const { props: heroPhone } = getImageProps({
    src: '/screenshots/sale-phone.png',
    alt: heroAlt,
    width: 360,
    height: 740,
    sizes: '300px',
    fetchPriority: 'high',
    loading: 'eager',
  });

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 text-fd-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(homeJsonLd(siteConfig)) }}
      />
      <section className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div>
          <p className="mb-4 text-sm text-fd-muted-foreground">{`Beta · version ${siteConfig.release}`}</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Point of sale for Medusa</h1>
          <p className="mt-6 text-lg text-fd-muted-foreground">
            MedusaPOS is an open-source till, free of charge under the MIT licence, for shops that run a Medusa v2 store and sell in person from the same catalogue. It runs in the browser, keeps selling when the connection drops, and never records the same sale twice in your Medusa store.
          </p>
          <div className="mt-8 flex gap-3 sm:gap-4">
            <a
              href={siteConfig.demoUrl}
              className="rounded-lg px-5 py-2.5 flex-1 text-center sm:flex-none font-medium bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/90"
            >
              Live demo
            </a>
            <Link
              href="/docs/quick-start"
              className="rounded-lg px-5 py-2.5 flex-1 text-center sm:flex-none font-medium border border-fd-border hover:bg-fd-accent"
            >
              Quick start
            </Link>
          </div>
          <p className="mt-4 text-sm text-fd-muted-foreground">
            The live demo signs you in with one click and resets every night. The web app needs a store on Medusa 2.21.0 exactly, with the MedusaPOS plugin installed: a one-time job for whoever runs your Medusa backend.
          </p>
          <p className="mt-1 text-sm text-fd-muted-foreground">
            Already installed? Staff start at{' '}
            <Link href="/docs/quick-start#sign-in" className="inline-block py-3 underline">
              Sign in
            </Link>
            .
          </p>
        </div>
        <figure className="mx-auto w-full max-w-[300px] md:max-w-none">
          <div className="rounded-xl border border-fd-border shadow-lg overflow-hidden">
            <picture>
              <source media="(min-width: 768px)" srcSet={heroDesktop.srcSet} sizes={heroDesktop.sizes} width={1000} height={680} />
              <img {...heroPhone} alt={heroAlt} className="h-auto w-full" />
            </picture>
          </div>
          {/* Desktop shot: the live demo's sale screen at a 1000 x 680 window, device scale 2, captured 2026-11-18 (medusapos/app main 5fc5b95). */}
          {/* One build: medusapos/app@bcd2047 apps/expo/vercel.json serves app.medusapos.com and the demo from one deployment. Order note: see the Not there yet item below. */}
          <figcaption className="mt-3 text-sm text-fd-muted-foreground">
            <span className="md:hidden">From the live demo on a phone, which runs the app&apos;s latest build, the same as app.medusapos.com.</span>
            <span className="hidden md:inline">From the live demo, which runs the app&apos;s latest build, the same as app.medusapos.com.</span>
          </figcaption>
        </figure>
      </section>

      <section className="py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">What it does today</h2>
        {/* Hosted build: medusapos/app@781cd94 docs/adr/0005-web-hosting-vercel.md ("Every push to main deploys to production"), apps/expo/vercel.json (app and demo, one deployment); plugin 0.2.3 fallback: apps/expo/components/register.tsx:146. */}
        {/* Tests: medusapos/app@c027779 .github/workflows/ci.yml runs pnpm test, pnpm e2e and pnpm e2e:rbac on every pull request and push to main. */}
        <p className="mt-4 text-fd-muted-foreground">
          {allReleased
            ? 'Everything below works today at app.medusapos.com, the hosted app, with version 0.2.3 of the plugin in your store. Each feature is covered by the app\'s '
            : 'Everything listed here is covered by the app\'s '}
          <a href={`${siteConfig.githubUrl}/actions/workflows/ci.yml`} className="underline">automated tests</a>
          {', which run on every change.'}
        </p>
        <p className="mt-3 text-sm sm:hidden">
          <a href="#not-there-yet" className="underline">What it doesn&apos;t do yet</a>
        </p>
        <div className="mt-8 grid grid-cols-1 gap-3 sm:gap-6 lg:grid-cols-3">
          {core.map((feature) => {
            const Icon = icons[feature.icon];
            return (
              <div key={feature.title} className="rounded-xl border border-fd-border bg-fd-card p-5 sm:p-7">
                {!feature.released && <p className="mb-2 text-sm text-fd-muted-foreground">In the live demo · next release</p>}
                <div className="flex items-center gap-3 sm:block">
                  <Icon size={24} className="shrink-0 text-fd-foreground" />
                  <h3 className="text-lg font-semibold sm:mt-4 sm:text-xl">{feature.title}</h3>
                </div>
                <p className="mt-2 text-sm text-fd-muted-foreground sm:text-base">{feature.description}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-10 font-semibold">Also at the till</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {more.map((feature, i) => {
            const Icon = icons[feature.icon];
            return (
              <div key={feature.title} className={`rounded-xl border border-fd-border bg-fd-card p-4 sm:p-5${spanLast && i === more.length - 1 ? ' sm:col-span-2 lg:col-span-1' : ''}`}>
                {!feature.released && <p className="mb-2 text-sm text-fd-muted-foreground">In the live demo · next release</p>}
                <div className="flex items-center gap-3">
                  <Icon size={18} className="shrink-0 text-fd-muted-foreground" />
                  <h3 className="text-base font-semibold">{feature.title}</h3>
                </div>
                <p className="mt-1 text-sm text-fd-muted-foreground sm:mt-2">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {!allReleased && (
        <section className="py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{`Live demo and release ${siteConfig.release}`}</h2>
          <p className="mt-4 text-fd-muted-foreground">
            {`The live demo and app.medusapos.com run the app's latest build. Release ${siteConfig.release} is the latest tagged version.`}
          </p>
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
      )}

      <section className="grid items-center gap-10 py-12 sm:py-16 md:grid-cols-[320px_1fr] lg:gap-16">
        <div className="hidden md:block w-[320px] max-w-full rounded-xl border border-fd-border shadow-lg overflow-hidden">
          <Image
            src="/screenshots/sale-phone.png"
            alt="MedusaPOS on a phone: a café and gift-shop catalogue in a two-column product grid, with the cart bar showing 4 items for €31.45"
            width={360}
            height={740}
            className="h-auto w-full"
          />
        </div>
        <div className="max-w-prose">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">In the browser you already have</h2>
          <p className="mt-4 text-fd-muted-foreground">
            Open app.medusapos.com in a current Chrome, Edge, Safari or Firefox and sign in with your store&apos;s backend URL and an admin account. The catalogue and unsent sales are kept in the browser&apos;s own storage, so a dropped connection doesn&apos;t lose a sale, and online a reload keeps every unsent sale.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <h2 id="not-there-yet" className="scroll-mt-20 text-2xl sm:text-3xl font-semibold tracking-tight">Not there yet</h2>
        <p className="mt-4 text-fd-muted-foreground">MedusaPOS is in beta. Today it does not:</p>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-fd-muted-foreground">
          {/* One till at a time: content/docs/registers.mdx line 76 and "Where registers come from"; medusapos/app@v0.2.0 docs/adr/0022-register-v2.md line 8. */}
          <li>add or rename registers: every store has one, Register 1, so one till at a time takes payment</li>
          <li>charge cards, or handle refunds and returns</li>
          <li>apply Medusa promotions or coupon codes (discounts are typed at the till)</li>
          <li>take tips, email receipts or show sales reports</li>
          {/* Approval: content/docs/registers.mdx (Get manager approval); medusapos/app@9ee493a apps/expo/lib/approval.ts requestApproval (no role check with plugin 0.2.3). */}
          <li>check who approves a large difference: with plugin 0.2.3 any login for your store can, including the cashier&apos;s own</li>
          {/* Order note: content/docs/limitations.mdx line 17 (sources) and line 23. */}
          <li>keep an order note with plugin 0.2.3: the hosted app shows an Order note box, but the note doesn&apos;t reach the order</li>
          <li>reload or reopen while offline: keep the tab open until you&apos;re back online</li>
          {/* Large catalogue: content/docs/limitations.mdx line 51 (0.1.0 report, no fix listed in 0.2.0). No figure: front-desk ruling. */}
          <li>stay fast with a large catalogue: the first sync is slow, and so is search</li>
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
          Whoever runs your Medusa backend installs the plugin and allows the POS origin once; the quick start walks through it. After that, staff open the web app and sign in with their Medusa admin account.
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

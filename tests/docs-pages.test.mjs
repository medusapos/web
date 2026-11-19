import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';

test('home hero is the 1000 x 680 capture', () => {
  const home = readFileSync(new URL('../app/(home)/page.tsx', import.meta.url), 'utf8');
  const png = readFileSync(new URL('../public/screenshots/sale-desktop-1000.png', import.meta.url));
  assert.equal(png.readUInt32BE(16), 2000, 'hero: png width');
  assert.equal(png.readUInt32BE(20), 1360, 'hero: png height');
  assert.ok(home.includes("src: '/screenshots/sale-desktop-1000.png',\n    alt: heroAlt,\n    width: 1000,\n    height: 680,"), 'hero: image props');
  assert.ok(home.includes('width={1000} height={680} />'), 'hero: source size');
  assert.ok(!/608|553/.test(home), 'hero: old size gone');
  assert.ok(home.includes('captured 2026-11-18 (medusapos/app main 5fc5b95)'), 'hero: capture cited');
  assert.ok(!existsSync(new URL('../public/screenshots/sale-desktop.png', import.meta.url)), 'hero: old file gone');
});

test('quick start says how to check the Medusa version', () => {
  const qs = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  const need = qs.slice(qs.indexOf('## What you need'), qs.indexOf('## Install the plugin'));
  const flat = need.replace(/\s+/g, ' ');
  assert.ok(flat.includes('and access to its configuration. To check, run `npm ls @medusajs/medusa` in your backend\'s directory. To move up'), 'quick-start: version check');
});

test('home shows the phone screenshot at 320 px', () => {
  const home = readFileSync(new URL('../app/(home)/page.tsx', import.meta.url), 'utf8');
  assert.ok(home.includes('<section className="grid items-start gap-10 py-12 sm:py-16 md:grid-cols-[320px_1fr] lg:gap-16">'), 'home: phone section on the content edges, 320 px column');
  assert.ok(!home.includes('max-w-4xl'), 'home: no narrower phone section box');
  assert.ok(home.includes('<figure className="hidden md:block w-[320px] max-w-full">'), 'home: phone shot 320 px');
  assert.ok(!home.includes('220px'), 'home: no 220 px phone shot');
});

test('registers says what a till and a register are', () => {
  const registers = readFileSync(new URL('../content/docs/registers.mdx', import.meta.url), 'utf8');
  const where = registers.slice(registers.indexOf('## Where registers come from'), registers.indexOf('## Open with your float'));
  assert.ok(where.includes('A till is a device running MedusaPOS, such as a counter screen or a phone.'), 'registers: till');
  assert.ok(where.includes('A register is the cash drawer and its record: a till opens it with a float, records cash in and out, then counts and closes it.'), 'registers: register');
  assert.ok(where.indexOf('A till is a device') < where.indexOf("You don't create registers."), 'registers: definitions first');
});

test('take over says how to account for the old till\'s cash', () => {
  const registers = readFileSync(new URL('../content/docs/registers.mdx', import.meta.url), 'utf8');
  assert.ok(registers.includes('Count the drawer by hand to account for that session\'s cash. Its sales are orders in Medusa Admin, under **Orders**; a sale the old till never sent isn\'t there.'), 'registers: take-over cash');
  assert.ok(!registers.includes('from the old till\'s own record'), 'registers: no own-record line');
});

test('home lists the slow large-catalogue sync, with no figure', () => {
  const home = readFileSync(new URL('../app/(home)/page.tsx', import.meta.url), 'utf8');
  assert.ok(home.includes('<li>stay fast with a large catalogue: the first sync is slow, and so is search</li>'), 'home: large catalogue item');
  assert.ok(!/2,000|45 s/.test(home), 'home: no figure');
});

test('footer Help opens Troubleshooting at the top', () => {
  const layout = readFileSync(new URL('../app/(home)/layout.tsx', import.meta.url), 'utf8');
  assert.ok(layout.includes('<Link href="/docs/troubleshooting" className="inline-block py-3 underline sm:py-0">\n              Help\n            </Link>'), 'footer: Help to Troubleshooting');
  assert.ok(!layout.includes('#report-a-problem'), 'footer: not the issue form');
});

test('the changelog says why the latest build shows v 0.2.0, and the home caption does not', () => {
  const home = readFileSync(new URL('../app/(home)/page.tsx', import.meta.url), 'utf8');
  const changelog = readFileSync(new URL('../content/docs/changelog.mdx', import.meta.url), 'utf8');
  assert.ok(!home.includes('until the next release'), 'home: no label caption');
  assert.ok(changelog.includes('app.medusapos.com and the live demo run the app\'s latest build. It shows **v 0.2.0** until the next release'), 'changelog: hosted build note');
});

test('the pay steps follow the hosted app\'s Checkout', () => {
  const till = readFileSync(new URL('../content/docs/at-the-till.mdx', import.meta.url), 'utf8');
  const quickStart = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  assert.ok(till.includes('2. Tap **Checkout**. The payment screen opens on **Cash**'), 'at-the-till: Checkout step');
  const changelog = readFileSync(new URL('../content/docs/changelog.mdx', import.meta.url), 'utf8');
  assert.ok(changelog.includes('in place of **Checkout**, and a card sale ends with **Payment approved on terminal**'), 'changelog: 0.2.0 pay note');
  assert.ok(changelog.includes('choose **Cash**, then **Split payment**'), 'changelog: 0.2.0 split note');
  assert.ok(!/from its tag|changelog#the-pay-screen-in-020/.test(till), 'at-the-till: no 0.2.0 tag note');
  assert.ok(!till.includes('2. Choose **Cash** or **Card terminal**'), 'at-the-till: old step');
  assert.ok(quickStart.includes('3. Tap **Checkout**. The payment screen opens on **Cash**; tap **Card terminal** for a card sale.'), 'quick-start: Checkout');
  assert.ok(till.includes('The payment screen opens on **Cash**; tap **Card terminal** for a card sale.') && !quickStart.includes('and choose **Cash** or **Card terminal**'), 'quick-start: same wording as at the till');
  assert.ok(till.includes('Its totals and the **Checkout** button stay in view.'), 'at-the-till: phone Checkout');
  assert.ok(till.includes('On the payment screen, key in part of the total on one tile and tap **Take**'), 'at-the-till: implicit split');
});

test('docs sidebar lists the store-owner pages in order', () => {
  const meta = JSON.parse(readFileSync(new URL('../content/docs/meta.json', import.meta.url), 'utf8'));
  assert.deepEqual(meta.pages, [
    'index', 'quick-start', 'plugin-setup', 'at-the-till', 'registers',
    'troubleshooting', 'limitations', 'changelog',
  ]);
});

test('each store-owner page has frontmatter and an app source citation', () => {
  for (const slug of ['plugin-setup', 'registers', 'at-the-till', 'troubleshooting', 'limitations']) {
    const source = readFileSync(new URL(`../content/docs/${slug}.mdx`, import.meta.url), 'utf8');
    const frontmatter = source.match(/^---\n([\s\S]*?)\n---\n/);
    assert.ok(frontmatter, slug);
    assert.match(frontmatter[1], /^title: .+$/m, slug);
    assert.match(frontmatter[1], /^description: .+$/m, slug);
    assert.ok(source.includes('Source: medusapos/app@c2db7b2'), slug);
  }
});

test('till features are task sections, not release sections', () => {
  const till = readFileSync(new URL('../content/docs/at-the-till.mdx', import.meta.url), 'utf8');
  const limitations = readFileSync(new URL('../content/docs/limitations.mdx', import.meta.url), 'utf8');
  const registers = readFileSync(new URL('../content/docs/registers.mdx', import.meta.url), 'utf8');
  assert.match(till, /^## Split payment$/m);
  assert.match(registers, /^## Take over a register$/m);
  for (const [name, source] of [['at-the-till', till], ['registers', registers], ['limitations', limitations]]) {
    assert.ok(!/New in 0\.2\.0/.test(source), name);
  }
  const npmInstall = 'npm install @medusapos/medusa-plugin@0.2.3';
  const quickStart = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  const pluginSetup = readFileSync(new URL('../content/docs/plugin-setup.mdx', import.meta.url), 'utf8');
  assert.ok(quickStart.includes(npmInstall), 'quick-start.mdx');
  assert.ok(!quickStart.includes('releases/download'), 'quick-start.mdx tarball');
  assert.ok(pluginSetup.includes('[Install the plugin](/docs/quick-start#install-the-plugin)'), 'plugin-setup.mdx');
  for (const [name, source] of [['quick-start.mdx', quickStart], ['plugin-setup.mdx', pluginSetup]]) {
    assert.ok(!source.includes('v0.1.0/medusapos-medusa-plugin-0.1.0.tgz'), name);
  }
});

test('home page points to the limitations page', () => {
  const source = readFileSync(new URL('../app/(home)/page.tsx', import.meta.url), 'utf8');
  assert.ok(source.includes('href="/docs/limitations"'));
  assert.ok(!source.includes('#known-mvp-limits'));
});

test('registers says how to move the register to another till', () => {
  const registers = readFileSync(new URL('../content/docs/registers.mdx', import.meta.url), 'utf8');
  assert.ok(registers.indexOf('## Move the register to another till') > -1 && registers.indexOf('## Move the register to another till') < registers.indexOf('## Take over a register'), 'registers: move before take over');
  assert.ok(registers.includes('close it on the till that holds it, then open it on the other till with a new float.'), 'registers: close then open');
});

test('the quick start names Register 1', () => {
  const quickStart = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  assert.ok(quickStart.includes('choose **Register 1** and [open it](/docs/registers#open-with-your-float)'), 'quick-start: Register 1');
  assert.ok(quickStart.includes('You can browse and fill the cart before that. In the live demo, choose **Demo register** instead.'), 'quick-start: demo register');
  assert.ok(!quickStart.includes('choose a register'), 'quick-start: no generic register');
});

test('quick start links all five store-owner pages', () => {
  const source = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  for (const slug of ['plugin-setup', 'at-the-till', 'registers', 'troubleshooting', 'limitations']) {
    assert.ok(source.includes(`/docs/${slug}`), slug);
  }
});

test('docs first load defers search and sidebar prefetch', () => {
  const rootLayout = readFileSync(new URL('../app/layout.tsx', import.meta.url), 'utf8');
  const docsLayout = readFileSync(new URL('../app/docs/layout.tsx', import.meta.url), 'utf8');
  assert.ok(rootLayout.includes('search={{ preload: false }}'));
  assert.ok(docsLayout.includes('sidebar={{ prefetch: false }}'));
});

test('the docs say the plugin needs exactly Medusa 2.21.0', () => {
  const limits = readFileSync(new URL('../content/docs/limitations.mdx', import.meta.url), 'utf8');
  const quickStart = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  assert.ok(limits.includes('- You need Medusa 2.21.0 exactly. Plugin 0.2.3 names that version, not a range,'), 'limitations: exact version');
  assert.ok(quickStart.includes('- A store on Medusa 2.21.0 exactly ([why this version](/docs/limitations#store-setup-limits))'), 'quick-start: exact version');
  const home = readFileSync(new URL('../app/(home)/page.tsx', import.meta.url), 'utf8');
  assert.ok(home.includes("The web app needs a store on{' '}") && home.includes('Medusa 2.21.0 exactly\n') && home.includes(', with the MedusaPOS plugin installed: a one-time job for whoever runs your Medusa backend.'), 'home: exact version');
  assert.ok(home.includes('The live demo signs you in with one click and resets every night.'), 'home: demo one click');
  assert.ok(!home.includes('Installing the plugin is a one-time job'), 'home: hero fine print is two sentences');
});

test('the site says app.medusapos.com runs the latest build', () => {
  const home = readFileSync(new URL('../app/(home)/page.tsx', import.meta.url), 'utf8');
  const quickStart = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  assert.ok(!home.includes('the version you install today'), 'home: install-today framing');
  assert.ok(home.includes('Everything below works today at app.medusapos.com, the hosted app, with version 0.2.3 of the plugin in your store.'), 'home: hosted intro');
  assert.ok(home.includes('runs the app&apos;s latest build, the same as app.medusapos.com.'), 'home: hosted build caption');
  assert.ok(home.includes('<li>keep an order note with plugin 0.2.3: the hosted app shows an Order note box'), 'home: order note limit');
  assert.ok(quickStart.includes("The hosted app at `https://app.medusapos.com` runs the app's latest build"), 'quick-start: hosted build');
});

test('the changelog dates the 0.1.0 catalogue fix line', () => {
  const changelog = readFileSync(new URL('../content/docs/changelog.mdx', import.meta.url), 'utf8');
  assert.ok(changelog.includes('**Site note**, November 2026: the 0.2.0 release notes list no fix for the large-catalogue sync.'), 'changelog: site note');
});

test('the quick start says the till shows only the channel\'s products', () => {
  const quickStart = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  assert.ok(/The till shows only the products in that sales channel, so add the\s+products you'll sell in person to it\./.test(quickStart), 'quick-start: channel products');
});

test('the quick start says to link one stock location', () => {
  const quickStart = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  assert.ok(/Link only that one stock location to the channel\s+\(\[why one location\]\(\/docs\/limitations#store-setup-limits\)\)\./.test(quickStart), 'quick-start: one location');
});

test('configure your store names the admin paths', () => {
  const qs = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  const configure = qs.slice(qs.indexOf('## Configure your store'), qs.indexOf('5. **A publishable API key.** Create (or reuse) a publishable API key'));
  assert.ok(/\*\*Settings → Locations & Shipping\*\*, open the location, and edit its\s+\*\*Sales Channels\*\* section\./.test(configure), 'quick-start: location path');
  assert.ok(/[Cc]lick \*\*Create option\*\*\s+and choose the profile in the \*\*Shipping Profile\*\* field\./.test(configure), 'quick-start: shipping option path');
  assert.ok(/go to \*\*Settings → Tax\s+Regions\*\* and create a region for that country\./.test(configure), 'quick-start: tax path');
});

test('plugin setup shows the redis locking example one property per line', () => {
  const ps = readFileSync(new URL('../content/docs/plugin-setup.mdx', import.meta.url), 'utf8');
  assert.ok(ps.includes("      providers: [{\n        resolve: '@medusajs/medusa/locking-redis',\n        id: 'locking-redis',\n        is_default: true,\n"), 'plugin-setup: provider one property per line');
  assert.ok(ps.includes('        redisUrl: process.env.LOCKING_REDIS_URL,\n'), 'plugin-setup: redisUrl on its own line');
  assert.ok(!ps.includes("modules: [{ resolve:"), 'plugin-setup: no packed example');
  assert.ok(ps.includes("Set `LOCKING_REDIS_URL` in every instance's environment to the URL of the same Redis server."), 'plugin-setup: says to set LOCKING_REDIS_URL');
});

test('plugin setup shows the postgres locking example', () => {
  const ps = readFileSync(new URL('../content/docs/plugin-setup.mdx', import.meta.url), 'utf8');
  assert.ok(ps.includes("      providers: [{\n        resolve: '@medusajs/medusa/locking-postgres',\n        id: 'locking-postgres',\n        is_default: true,\n      }],\n"), 'locking: postgres block');
  assert.ok(ps.includes('Then run `npx medusa db:migrate` to create its `locking` table.'), 'locking: postgres migration');
  assert.ok(!ps.includes('run the migration again'), 'locking: no vague migration line');
  assert.ok(ps.indexOf('locking-redis') < ps.indexOf("resolve: '@medusajs/medusa/locking-postgres'"), 'locking: postgres after redis');
  assert.ok(ps.includes('infrastructure-modules/locking/postgres'), 'locking: source cited');
});

test('home links automated tests to the app CI workflow', () => {
  const home = readFileSync(new URL('../app/(home)/page.tsx', import.meta.url), 'utf8');
  assert.ok(home.includes('<a href={`${siteConfig.githubUrl}/actions/workflows/ci.yml`} className="underline">automated tests</a>'), 'home: tests link');
  assert.ok(!home.includes("automated tests, which run on every change"), 'home: no unlinked tests line');
});

test('docs show the payment screen, the count and the Z report', () => {
  const till = readFileSync(new URL('../content/docs/at-the-till.mdx', import.meta.url), 'utf8');
  const reg = readFileSync(new URL('../content/docs/registers.mdx', import.meta.url), 'utf8');
  const close = reg.slice(reg.indexOf('## Count and close'), reg.indexOf('## Get manager approval'));
  assert.ok(till.includes('\n   <DocImage src={tillPayment} alt="The payment screen: the €16.95 total, the Cash and Card terminal tiles, amount keys, and the Take €16.95 in Cash button above Complete sale" preload />\n'), 'till-payment: indented preloaded image with alt text');
  assert.ok(readFileSync(new URL('../public/screenshots/docs/till-payment.jpg', import.meta.url)).length > 20000, 'till-payment: file present');
  for (const [page, name] of [[close, 'registers-count'], [close, 'registers-closure']]) {
    assert.ok(new RegExp(`\\n   !\\[[^\\]]{40,}\\]\\(/screenshots/docs/${name}\\.jpg\\)\\n`).test(page), `${name}: indented image with alt text`);
    assert.ok(readFileSync(new URL(`../public/screenshots/docs/${name}.jpg`, import.meta.url)).length > 20000, `${name}: file present`);
  }
  assert.ok(till.indexOf('<DocImage src={tillPayment}') > till.indexOf('2. Tap **Checkout**') && till.indexOf('<DocImage src={tillPayment}') < till.indexOf('3. For cash'), 'till: shot under step 2');
  assert.ok(close.indexOf('registers-count.jpg') < close.indexOf('3. Tap **Close register** again'), 'registers: count shot under step 2');
  assert.ok(close.indexOf('registers-closure.jpg') < close.indexOf('4. Tap **Done**'), 'registers: closure shot under step 3');
  assert.ok(close.includes('4. Tap **Done**. The **Open register** panel now offers **Use the last counted cash**, with the amount you just counted.'), 'registers: step 4 names the button');
  assert.ok(close.includes("To keep a paper copy, tap **Print the Z report**; your browser's print dialog opens, as for receipts."), 'registers: print the Z report');
  assert.ok(close.indexOf('**Print the Z report**') < close.indexOf('4. Tap **Done**'), 'registers: print before Done');
  assert.ok(close.includes('register-close.tsx:212') && close.includes('closure-print.ts printHtml'), 'registers: print source cited');
  assert.ok(!reg.includes('open card'), 'registers: no open card');
  const mdx = readFileSync(new URL('../mdx-components.tsx', import.meta.url), 'utf8');
  assert.ok(mdx.includes('className="mx-auto w-full rounded-xl border border-fd-border shadow-lg"') && !mdx.includes('max-w-sm') && !mdx.includes('max-w-md'), 'mdx: framed screenshots, no fixed box');
  assert.ok(mdx.includes("from 'fumadocs-ui/components/image-zoom'") && mdx.includes('img: DocImage') && mdx.includes('<ImageZoom\n'), 'mdx: screenshots zoom');
  assert.ok(mdx.includes('className="-mt-6 block text-center text-xs text-fd-muted-foreground sm:hidden">') && mdx.includes('Tap to enlarge') && mdx.includes('<span className="block">'), 'mdx: phone screenshots say a tap enlarges them');
  assert.ok(mdx.includes("typeof src === 'object' && src ? Number(src.width)") && mdx.includes('maxWidth: width > 0 ? width / 2 : undefined'), 'mdx: half the static image width, one scale');
});

test('the quick start says to count and close the register', () => {
  const quickStart = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  const sale = quickStart.slice(quickStart.indexOf('## Make a sale'), quickStart.indexOf('## Known beta limits'));
  assert.ok(sale.includes('At the end of the day, [count and close](/docs/registers#count-and-close) the register.'), 'quick-start: close line');
});

test('sign in says what the backend URL is', () => {
  const quickStart = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  const signIn = quickStart.slice(quickStart.indexOf('## Sign in'), quickStart.indexOf('## Make a sale'));
  assert.ok(signIn.includes('Your backend URL is the address of your Medusa server, such as `https://api.example.com`.'), 'quick-start: backend URL');
  assert.ok(signIn.includes('leave `/app` off.'), 'quick-start: no /app');
});

test('home says the offline caveat once and the one-till limit first', () => {
  const home = readFileSync(new URL('../app/(home)/page.tsx', import.meta.url), 'utf8');
  assert.equal(home.match(/keep the tab open/g)?.length, 1, 'home: one offline caveat');
  assert.ok(home.includes('<li>reload or reopen while offline: keep the tab open until you&apos;re back online</li>'), 'home: offline caveat in Not there yet');
  assert.ok(home.includes('<li>add or rename registers: every store has one, Register 1, so one till at a time takes payment</li>'), 'home: registers bullet says one till');
  assert.ok(home.indexOf('<li>add or rename registers') < home.indexOf('<li>charge cards'), 'home: one-till limit first');
});

test('quick start says how to add a service zone', () => {
  const qs = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  const flat = qs.replace(/\s+/g, ' ');
  assert.ok(flat.includes("2. Add a service zone, the area the option serves: in that section's three-dot menu choose **Create service zone**, enter a **Name**, click **Manage areas**, check your shop's country and save."), 'zone: steps');
  assert.ok(flat.includes('3. Click **Create option** and choose the profile in the **Shipping Profile** field.'), 'zone: then the option');
  assert.ok(qs.includes('"Create Service Zone")'), 'zone: source cited');
});

test('quick start names the take step', () => {
  const qs = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  const sale = qs.slice(qs.indexOf('## Make a sale'), qs.indexOf('At the end of the day'));
  assert.ok(/key in\s+the amount handed over or tap \*\*Exact\*\*, then tap \*\*Take\*\*\./.test(sale), 'quick-start: cash take step');
  assert.ok(/tap \*\*Take\*\* and enter\s+the terminal's reference/.test(sale), 'quick-start: card take step');
  assert.ok(!sale.includes('take the payment,\nthen tap'), 'quick-start: no vague take the payment');
  assert.ok(sale.indexOf('**Take**') < sale.indexOf('**Complete sale**'), 'quick-start: take before complete');
});

test('quick start says how staff get their own logins', () => {
  const qs = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  const step6 = qs.slice(qs.indexOf('6. **Admin and staff logins.** If you do not have an admin user'), qs.indexOf('## Choose who may use the POS'));
  const flat = step6.replace(/\s+/g, ' ');
  assert.ok(flat.includes('Give each member of staff their own login: in Medusa Admin, go to **Settings → Users**, click **Invite**, enter their email and click **Send invite**.'), 'quick-start: invite steps');
  assert.ok(flat.includes('choose **Copy invite link** from the invite\'s menu'), 'quick-start: copy invite link');
  assert.ok(step6.includes('docs.medusajs.com/user-guide/settings/users/invites'), 'quick-start: invite source cited');
  assert.ok(step6.indexOf('The POS signs in with that email and password.') < step6.indexOf('Give each member of staff'), 'quick-start: invites after the admin user');
});

test('at the till says how the receipt prints', () => {
  const till = readFileSync(new URL('../content/docs/at-the-till.mdx', import.meta.url), 'utf8');
  const print = till.slice(till.indexOf('## Print the receipt'), till.indexOf('## Use a phone'));
  assert.match(till, /^## Print the receipt$/m, 'print: heading');
  assert.ok(till.indexOf('## Read the receipt') < till.indexOf('## Print the receipt'), 'print: after read the receipt');
  assert.ok(print.includes("Tap **Print receipt** on the receipt. It opens the browser's print dialog"), 'print: button and dialog');
  assert.ok(print.includes('**Automatically print receipt after checkout** in **Settings → Printing**. It is off by default and is saved on this till only.'), 'print: auto-print setting');
  assert.ok(print.includes('settings.tsx lines 225-240'), 'print: source cited');
  assert.ok(till.includes('[print it](#print-the-receipt)'), 'print: take-a-sale link');
  assert.ok(!/drawer|thermal|80 ?mm/i.test(print), 'print: no hardware claims');
});

test('at the till names the cart + menu for discounts and charges', () => {
  const till = readFileSync(new URL('../content/docs/at-the-till.mdx', import.meta.url), 'utf8');
  const discount = till.slice(till.indexOf('## Apply a discount'), till.indexOf('## Read the receipt'));
  const fees = till.slice(till.indexOf('## Fees, delivery charges and one-off items'), till.indexOf('## Grid or table, and categories'));
  assert.ok(discount.includes("Use a line's **Discount** action, or for the whole order tap the cart's **+** button and choose **Add Discount**. Choose **Percent** or **Amount**"), 'till: order discount in the + menu');
  assert.ok(!till.includes('below the lines'), 'till: no control below the lines');
  assert.ok(fees.includes("to a sale. Tap the cart's **+** button, beside the customer, and choose **Add Fee**, **Add Shipping** or **Add Miscellaneous Product**. Your store records"), 'till: fees name the control');
  assert.ok(till.includes('cart-add-menu.tsx:32-37'), 'till: menu source cited');
});

test('registers says who can approve a large difference', () => {
  const features = readFileSync(new URL('../lib/features.ts', import.meta.url), 'utf8');
  const intro = readFileSync(new URL('../content/docs/index.mdx', import.meta.url), 'utf8');
  const reg = readFileSync(new URL('../content/docs/registers.mdx', import.meta.url), 'utf8');
  const home = readFileSync(new URL('../app/(home)/page.tsx', import.meta.url), 'utf8');
  const limits = readFileSync(new URL('../content/docs/limitations.mdx', import.meta.url), 'utf8');
  assert.ok(features.includes('then count and close. The closure is your Z report.') && !features.includes('asks for a sign-in'), 'approval: home card');
  assert.ok(!features.includes("cashier's own"), 'approval: caveat not on the card');
  assert.ok(intro.includes('count and close. The closure is your Z report.') && !intro.includes('asks for a sign-in'), 'approval: introduction');
  assert.ok(home.includes('<li>check who approves a large difference: with plugin 0.2.3 any login for your store can, including the cashier&apos;s own</li>'), 'approval: in Not there yet');
  assert.ok(home.indexOf('id="not-there-yet"') < home.indexOf('check who approves a large difference'), 'approval: under Not there yet');
  assert.ok(limits.includes("- With plugin 0.2.3, any login for your store can approve a large difference, including the cashier's own."), 'approval: limitations');
  assert.ok(!features.includes("manager's approval") && !intro.includes('manager approval'), 'approval: no manager promise');
  assert.ok(!features.includes('store admin') && !intro.includes('store admin') && !reg.includes('admin of your Medusa store'), 'approval: no admin-only wording');
  assert.ok(reg.includes('closing needs someone to sign in and approve it.') && reg.includes('The approver signs in with their email and password'), 'approval: registers limit line');
  assert.ok(reg.includes("This doesn't sign you out. If you are on your own, approve with your own login. With plugin 0.2.3 the till checks the email and password, not the user's role, so any login for your store can approve, including the cashier's own."), 'approval: who can approve');
  assert.ok(reg.includes('register.tsx:160'), 'approval: source cited');
});

test('quick start gives POS access its own section', () => {
  const qs = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  const ts = readFileSync(new URL('../content/docs/troubleshooting.mdx', import.meta.url), 'utf8');
  const cl = readFileSync(new URL('../content/docs/changelog.mdx', import.meta.url), 'utf8');
  assert.match(qs, /^## Choose who may use the POS$/m, 'access: own heading');
  assert.ok(qs.indexOf('## Configure your store') < qs.indexOf('## Choose who may use the POS') && qs.indexOf('## Choose who may use the POS') < qs.indexOf('## Sign in'), 'access: between configure and sign in');
  assert.match(qs, /^1\. Turn RBAC on\./m, 'access: steps at top level');
  assert.ok(!qs.includes('7. Optional'), 'access: no step 7');
  assert.ok(!qs.includes('### Running more than one Medusa instance'), 'locking: no repeated section');
  assert.ok(qs.includes('/docs/plugin-setup#if-you-run-more-than-one-medusa-instance'), 'locking: points at plugin setup');
  for (const [name, text] of [['troubleshooting', ts], ['changelog', cl]]) {
    assert.ok(text.includes('/docs/quick-start#choose-who-may-use-the-pos'), `${name}: links the new section`);
    assert.ok(!text.includes('step 7 of'), `${name}: no step 7`);
  }
});

test('quick start sets up the sales region', () => {
  const qs = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  const start = qs.indexOf('4. **A region, prices and tax.** Make sure a region covers');
  assert.ok(start > qs.indexOf('## Configure your store'), 'region: step 4');
  const step = qs.slice(start, qs.indexOf('5. **A publishable API key.** Create (or reuse) a publishable API key')).replace(/\s+/g, ' ');
  assert.ok(step.startsWith("4. **A region, prices and tax.** Make sure a region covers the location's country, in the currency you sell in:"), 'region: step');
  assert.ok(step.includes('go to **Settings → Regions**; if no region lists that country, click **Create**, choose the **Currency** and add the country under **Countries**.'), 'region: admin path');
  assert.ok(step.includes("so give each product you'll sell in person a price in its currency."), 'region: prices');
  assert.ok(step.indexOf('**Settings → Regions**') < step.indexOf('**Settings → Tax Regions**'), 'region: before tax');
  assert.ok(!/inventory|stock level/i.test(step), 'region: no inventory claim');
  assert.ok(qs.includes('/user-guide/settings/regions ("Create", "Currency", "Countries")') && qs.includes('docs/testers.md (Set up this till'), 'region: sources cited');
});

test('the quick start splits steps 3 and 4 into substeps', () => {
  const qs = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  const three = qs.slice(qs.indexOf('3. **A shipping option.** Create a shipping option'), qs.indexOf('4. **A region, prices and tax.** Make sure a region covers'));
  assert.ok(three.includes("On the location's page:\n   1. Enable **Pickup** (or **Shipping**).\n   2. Add a service zone"), 'substeps: step 3 opens its list');
  assert.ok(three.includes('\n   3. Click **Create option**'), 'substeps: step 3 ends with the option');
  const four = qs.slice(qs.indexOf('4. **A region, prices and tax.** Make sure a region covers'), qs.indexOf('5. **A publishable API key.** Create (or reuse) a publishable API key'));
  assert.ok(four.includes('sell in:\n   1. In the Medusa admin, go to **Settings → Regions**'), 'substeps: step 4 opens its list');
  assert.ok(four.includes('\n   3. Tax is set up separately: go to **Settings → Tax Regions**'), 'substeps: step 4 ends with tax');
});

test('plugin setup links to the update precautions', () => {
  const setup = readFileSync(new URL('../content/docs/plugin-setup.mdx', import.meta.url), 'utf8');
  assert.ok(setup.includes('Updating from 0.1.0? First read [Updating to 0.2.0](/docs/troubleshooting#updating-to-020): every till must send all its sales before you update.'), 'update: link first');
  assert.ok(setup.includes('Then run the same install and migration, and restart the backend.'), 'update: then install');
  const trouble = readFileSync(new URL('../content/docs/troubleshooting.mdx', import.meta.url), 'utf8');
  assert.ok(trouble.includes('\n## Updating to 0.2.0\n'), 'update: target heading');
  assert.ok(trouble.includes('Before updating, make sure every till has sent all its sales'), 'update: target says so');
});

test('registers says what the last closure shows for sales not yet sent', () => {
  const reg = readFileSync(new URL('../content/docs/registers.mdx', import.meta.url), 'utf8');
  const close = reg.slice(reg.indexOf('## Count and close'), reg.indexOf('## Get manager approval'));
  assert.ok(close.includes("Between sessions, the register's state shows the last closure's figures. If sales were still waiting to sync when you closed, it shows a warning such as **1 sale not sent yet · €15.00**; [Check sync status](/docs/troubleshooting#check-sync-status) shows when they reach the store."), 'unsynced: last closure line');
  assert.ok(close.includes('register-close.tsx:205-206'), 'unsynced: source cited');
  const trouble = readFileSync(new URL('../content/docs/troubleshooting.mdx', import.meta.url), 'utf8');
  assert.ok(trouble.includes('\n## Check sync status\n'), 'unsynced: link target');
});

test('quick start gives the sale as numbered steps', () => {
  const qs = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  const sale = qs.slice(qs.indexOf('## Make a sale'), qs.indexOf('At the end of the day'));
  const steps = sale.split('\n').filter((line) => /^\d\. /.test(line));
  assert.equal(steps.length, 5, 'sale steps: five');
  assert.ok(steps.every((line, i) => line.startsWith(`${i + 1}. `)), 'sale steps: in order');
  assert.ok(steps[0].startsWith("1. Tap the register's state at the right of the header, or on a phone at the right end of the row under it (it reads **Register** until you choose one), then choose **Register 1**"), 'sale steps: where to tap');
  assert.ok(steps[2].startsWith('3. Tap **Checkout**.') && steps[4].startsWith('5. Tap **Complete sale**'), 'sale steps: checkout then complete');
  assert.ok(sale.includes('[Take a sale](/docs/at-the-till#take-a-sale) has more on each step.'), 'sale steps: link kept');
});

test("the 2.21.0 requirement links Medusa's update guide", () => {
  const guide = "To move up from an older version, follow Medusa's [Updating Medusa](https://docs.medusajs.com/learn/update) guide.";
  const next = 'To ask for support for your version, [send feedback](/docs/troubleshooting#report-a-problem).';
  const qs = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  const need = qs.slice(qs.indexOf('## What you need'), qs.indexOf('## Install the plugin')).replace(/\s+/g, ' ');
  assert.ok(need.includes(`directory. ${guide} A store already on a newer version can't use plugin 0.2.3. ${next}`), 'update: quick start');
  const lim = readFileSync(new URL('../content/docs/limitations.mdx', import.meta.url), 'utf8');
  assert.ok(lim.includes(`and \`@medusajs/framework\`. ${guide} A store already on a newer version can't use plugin 0.2.3. ${next}`), 'update: limitations');
  assert.ok([qs, lim].every((t) => !t.includes('move the store to 2.21.0 first') && !t.includes('move a store on another version')), 'newer: no move-down advice');
});

test('the 50-sale batch limit is in Limitations, Troubleshooting and Not there yet', () => {
  const [lim, trouble, home] = ['../content/docs/limitations.mdx', '../content/docs/troubleshooting.mdx', '../app/(home)/page.tsx'].map((p) => readFileSync(new URL(p, import.meta.url), 'utf8'));
  const item = "- The store refuses a batch of more than 50 sales, or one over the size limit, whole. The till can't split it and resend it in smaller pieces yet.";
  assert.ok(lim.includes(item), 'batch: limitations');
  assert.ok(lim.indexOf(item) > lim.indexOf('## Till limits'), 'batch: under till limits');
  const at = trouble.indexOf("there is nothing in the store to fix, and the till can't split it yet");
  assert.ok(at !== -1, 'batch: troubleshooting');
  assert.ok(at > trouble.indexOf('### Not accepted') && at < trouble.indexOf('## "This account can\'t use the POS"'), 'batch: under not accepted');
  const li = '<li>send a batch of more than 50 sales: the store refuses it whole, and the till can&apos;t split it yet</li>';
  assert.ok(home.includes(li), 'batch: home');
  assert.ok(home.indexOf(li) > home.indexOf('id="not-there-yet"'), 'batch: under not there yet');
});

test('the hero says one register per store', () => {
  const home = readFileSync(new URL('../app/(home)/page.tsx', import.meta.url), 'utf8');
  const hero = 'It runs in the browser on one register per store, keeps selling when the connection drops';
  assert.ok(home.includes(hero), 'hero: one register');
  assert.ok(home.indexOf(hero) < home.indexOf('href={siteConfig.demoUrl}'), 'hero: before the buttons');
});

test('the changelog RBAC line keeps super admins in', () => {
  const log = readFileSync(new URL('../content/docs/changelog.mdx', import.meta.url), 'utf8');
  assert.ok(log.includes('With RBAC on, only super admins and people with a "POS cashier" or "POS manager" role can.'), 'changelog: super admins');
  assert.ok(!log.includes('With RBAC on, only people with'), 'changelog: no roles-only line');
});

test('the quick start goes straight to What you need', () => {
  const qs = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  const intro = qs.slice(qs.indexOf('---', 3), qs.indexOf('## What you need'));
  assert.ok(!intro.includes('MedusaPOS is a browser point of sale'), 'quick start: no repeated pitch');
  assert.ok(intro.includes('To look around first, open the [live demo](https://demo.medusapos.com/demo): it resets every night.'), 'quick start: demo kept');
});

test('the phone On this page bar has no progress ring', () => {
  const css = readFileSync(new URL('../app/global.css', import.meta.url), 'utf8');
  assert.match(css, /\[data-toc-popover-trigger\] > svg\[role='progressbar'\] \{\s*display: none;\s*\}/, 'toc: ring hidden');
});

test('the quick start shows the sign-in form', () => {
  const qs = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  const signIn = qs.slice(qs.indexOf('## Sign in'), qs.indexOf('## Make a sale'));
  const shot = '![The MedusaPOS sign-in form: Backend URL filled in with https://api.example.com, empty Email and Password fields, the Sign in button and a Send feedback link](/screenshots/docs/quick-start-signin.jpg)';
  assert.ok(signIn.includes(shot), 'sign in: screenshot in Sign in');
  assert.ok(signIn.indexOf(shot) > signIn.indexOf('you are online before selling offline.'), 'sign in: screenshot after the steps');
  assert.ok(signIn.includes('medusapos/app main was ba317a1 at capture'), 'sign in: capture cited');
  assert.ok(existsSync(new URL('../public/screenshots/docs/quick-start-signin.jpg', import.meta.url)), 'sign in: image file');
});

test('the Docs link is never marked as the selected item', () => {
  const layout = readFileSync(new URL('../lib/layout.shared.tsx', import.meta.url), 'utf8');
  assert.ok(layout.includes("{ text: 'Docs', url: '/docs', active: 'none' },"), 'sidebar: Docs link not active');
  assert.ok(!layout.includes("active: 'nested-url'"), 'sidebar: no nested-url Docs pill');
});

test('the home page links Medusa 2.21.0 exactly to the version check', () => {
  const home = readFileSync(new URL('../app/(home)/page.tsx', import.meta.url), 'utf8');
  assert.ok(home.includes('<Link href="/docs/quick-start#what-you-need" className="underline">\n              Medusa 2.21.0 exactly\n            </Link>'), 'home: 2.21.0 links to What you need');
  assert.ok(!home.includes('needs a store on Medusa 2.21.0 exactly, with'), 'home: no unlinked 2.21.0');
  const qs = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  assert.ok(qs.includes('## What you need') && qs.includes('`npm ls @medusajs/medusa`'), 'home: target has the check');
});

test('the browser band captions its phone screenshot', () => {
  const home = readFileSync(new URL('../app/(home)/page.tsx', import.meta.url), 'utf8');
  assert.ok(home.includes('>The same app on a phone</figcaption>'), 'band: caption');
  assert.ok(home.includes('alt="MedusaPOS on a phone: a café and gift-shop catalogue'), 'band: alt kept');
});

test('wrapped code lines keep their indentation', () => {
  const cfg = readFileSync(new URL('../source.config.ts', import.meta.url), 'utf8');
  assert.ok(cfg.includes('...(rehypeCodeDefaultOptions.transformers ?? [])'), 'code: default transformers kept');
  assert.ok(cfg.includes("name: 'medusapos:wrap-indent'") && cfg.includes('--wrap-indent:${indent + 2}ch'), 'code: wrap-indent transformer');
  const css = readFileSync(new URL('../app/global.css', import.meta.url), 'utf8');
  assert.match(css, /padding-left: calc\(var\(--padding-left\) \+ var\(--wrap-indent, 0px\)\);\s*text-indent: calc\(-1 \* var\(--wrap-indent, 0px\)\);/, 'code: hanging indent');
});

test('Configure your store shows the CORS lines', () => {
  const qs = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  assert.ok(qs.includes('   ```text\n   ADMIN_CORS=<your existing origins>,https://app.medusapos.com\n   AUTH_CORS=<your existing origins>,https://app.medusapos.com\n   ```'), 'cors: block inside step 1');
  assert.ok(qs.includes('after\n   the origins already there and separated by a comma.'), 'cors: comma rule');
});

test('held sales says where the resolve script is in a workspace', () => {
  const ts = readFileSync(new URL('../content/docs/troubleshooting.mdx', import.meta.url), 'utf8');
  const i = ts.indexOf('tally-ledger-resolve.js <commandId> apply\n```');
  const j = ts.indexOf("If your backend is in an npm or Yarn workspace, the plugin is usually installed in the workspace root's `node_modules`");
  const k = ts.indexOf('- `apply`: you have fixed the order by hand.');
  assert.ok(i > 0 && j > i && k > j, 'held sales: workspace note between command and apply');
});

test('the docs name the register state label', () => {
  const qs = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  assert.ok(qs.includes("1. Tap the register's state at the right of the header, or on a phone at the right end of the row under it (it reads **Register** until you choose one), then choose **Register 1** and"), 'register label: quick start');
  const reg = readFileSync(new URL('../content/docs/registers.mdx', import.meta.url), 'utf8');
  assert.ok(reg.includes("The register's state shows at the right of the header, or on a phone at the right end of the row under the header. Until a register is chosen, it reads **Register**."), 'register label: registers');
  assert.ok(!qs.includes('Under the header, tap') && !reg.includes('shows under the header;'), 'register place: old wording gone');
});

test('the docs layout drops the shared Docs link', () => {
  const layout = readFileSync(new URL('../app/docs/layout.tsx', import.meta.url), 'utf8');
  assert.ok(layout.includes("link.url === '/docs'"), 'docs layout: filters the Docs link');
  assert.ok(layout.includes('{...base} links={links}'), 'docs layout: filtered links win over the shared ones');
  const shared = readFileSync(new URL('../lib/layout.shared.tsx', import.meta.url), 'utf8');
  assert.ok(shared.includes("{ text: 'Docs', url: '/docs', active: 'none' },"), 'docs layout: home header keeps Docs');
});

test('the changelog says its entries are edited and marks the site notes', () => {
  const changelog = readFileSync(new URL('../content/docs/changelog.mdx', import.meta.url), 'utf8');
  assert.ok(changelog.includes('Each entry follows the release note published with that version on [GitHub](https://github.com/medusapos/app/releases), edited for this site. Notes the site added start with **Site note**.'), 'changelog intro: edited');
  assert.ok(!changelog.includes('Each entry is the release note'), 'changelog intro: old wording gone');
  const pay = changelog.slice(changelog.indexOf('### The pay screen in 0.2.0'), changelog.indexOf("### What's new for your store"));
  assert.ok(/\n\*\*Site note:\*\* if you run 0\.2\.0 from its tag/.test(pay), 'changelog intro: pay screen is a site note');
});

test('configure your store gives each step a bold lead', () => {
  const qs = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  const configure = qs.slice(qs.indexOf('## Configure your store'), qs.indexOf('## Choose who may use the POS'));
  const leads = [...configure.matchAll(/^(\d)\. \*\*([^*]+)\*\* /gm)].map((m) => `${m[1]} ${m[2]}`);
  assert.deepEqual(leads, [
    '1 Allow the POS origin.',
    '2 One stock location.',
    '3 A shipping option.',
    '4 A region, prices and tax.',
    '5 A publishable API key.',
    '6 Admin and staff logins.',
  ], 'configure leads: six, in order');
});

test('make a sale shows the register control under step 1', () => {
  const qs = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  const sale = qs.slice(qs.indexOf('## Make a sale'), qs.indexOf('2. Scan a barcode'));
  const shot = "\n   ![The right end of the till header: Register › beside the signed-in cashier's initial and email](/screenshots/docs/till-register-control.jpg)\n";
  assert.ok(sale.includes(shot), 'register shot: indented under step 1');
  assert.ok(sale.indexOf('1. Tap the register') < sale.indexOf(shot), 'register shot: after step 1');
  assert.ok(sale.includes('{/* Screenshot: cropped from public/screenshots/sale-desktop-1000.png'), 'register shot: source comment');
  const jpg = readFileSync(new URL('../public/screenshots/docs/till-register-control.jpg', import.meta.url));
  assert.ok(jpg[0] === 0xff && jpg[1] === 0xd8 && jpg.length > 8000, 'register shot: jpeg file present');
});

test('Not there yet sits beside the phone screenshot', () => {
  const home = readFileSync(new URL('../app/(home)/page.tsx', import.meta.url), 'utf8');
  const band = home.slice(home.indexOf('md:grid-cols-[320px_1fr]'), home.indexOf('<section className="border-t border-fd-border'));
  assert.ok(band.includes('In the browser you already have'), 'band: browser heading');
  assert.ok(band.includes('<h2 id="not-there-yet" className="mt-12 scroll-mt-20 text-2xl sm:text-3xl font-semibold tracking-tight">Not there yet</h2>'), 'band: Not there yet inside');
  assert.ok(band.indexOf('In the browser you already have') < band.indexOf('id="not-there-yet"'), 'band: browser first');
  assert.ok(band.includes('href="/docs/limitations"'), 'band: limitations link inside');
  assert.ok(!band.includes('<section '), 'band: no other section inside');
  assert.ok(!home.includes('<section className="py-12 sm:py-16">\n        <h2 id="not-there-yet"'), 'band: no separate Not there yet section');
});

test('the introduction asks for Medusa 2.21.0 exactly', () => {
  const intro = readFileSync(new URL('../content/docs/index.mdx', import.meta.url), 'utf8');
  const need = intro.slice(intro.indexOf('## What you need'), intro.indexOf('## Status'));
  assert.ok(need.includes('- A store on Medusa 2.21.0 exactly ([why this version](/docs/limitations#store-setup-limits)), with the MedusaPOS plugin installed.\n'), 'intro: exactly, with the why link');
  assert.ok(!intro.includes('A Medusa 2.21.0 store'), 'intro: no bare version');
});

test('At the till opens with Take a sale, and setup comes last', () => {
  const till = readFileSync(new URL('../content/docs/at-the-till.mdx', import.meta.url), 'utf8');
  const h2s = [...till.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
  assert.equal(h2s[0], 'Take a sale', 'till order: Take a sale first');
  assert.deepEqual(h2s.slice(-3), ['Grid or table, and categories', 'Set up this till', 'Not yet'], 'till order: setup before Not yet');
  const setup = till.slice(till.indexOf('## Set up this till'), till.indexOf('## Not yet'));
  assert.ok(setup.startsWith('## Set up this till\n\nOn first sign-in, MedusaPOS resolves') && setup.endsWith('Another till that finds the register open shows that name.\n\n'), 'till order: section moved whole');
  assert.ok(till.includes('description: Take a sale, scan, discount and print the receipt, and set up a till.'), 'till order: description');
});

test('Quick start shows the payment screen under its Checkout step', () => {
  const qs = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  const sale = qs.slice(qs.indexOf('## Make a sale'), qs.indexOf('## Known beta limits'));
  const shot = '\n   ![The payment screen: the €16.95 total, the Cash and Card terminal tiles, amount keys, and the Take €16.95 in Cash button above Complete sale](/screenshots/docs/till-payment.jpg)\n';
  assert.ok(sale.includes(shot), 'qs payment: indented image with the till page alt text');
  assert.ok(sale.indexOf(shot) > sale.indexOf('3. Tap **Checkout**') && sale.indexOf(shot) < sale.indexOf('4. For cash'), 'qs payment: under step 3');
  assert.equal(qs.split('till-payment.jpg').length, 2, 'qs payment: once');
});

test('Plugin setup adds locking to the existing modules array', () => {
  const setup = readFileSync(new URL('../content/docs/plugin-setup.mdx', import.meta.url), 'utf8');
  const section = setup.slice(setup.indexOf('## If you run more than one Medusa instance'), setup.indexOf('## What a sale records'));
  assert.ok(section.includes('For Redis, add this entry to the `modules` array in `medusa-config.ts`, keeping the modules already there, such as RBAC:'), 'locking: Redis sentence');
  assert.ok(section.includes('add this entry to `modules` instead:'), 'locking: Postgres sentence');
  assert.equal(section.split('modules: [\n  // ...the modules you already have, such as RBAC\n  {\n    resolve: \'@medusajs/medusa/locking\',').length, 3, 'locking: both blocks are one entry after the existing modules');
  assert.ok(!section.includes('modules: [{'), 'locking: no bare modules array');
  assert.ok(section.includes("resolve: '@medusajs/medusa/locking-redis'") && section.includes("resolve: '@medusajs/medusa/locking-postgres'"), 'locking: both providers kept');
});

test('code blocks get a break point after each slash and before each member name', () => {
  const config = readFileSync(new URL('../source.config.ts', import.meta.url), 'utf8');
  assert.ok(config.includes('const PATH_BREAK = /(?<=\\/)(?!\\/)/;'), 'code wrap: path break after a slash');
  assert.ok(config.includes('const MEMBER_BREAK = /(?<=[\\w$)\\]]\\.)(?=[A-Za-z_$])(?!(?:[cm]?[jt]sx?|json)\\b)/;'), 'code wrap: member break after a dot that follows a name');
  assert.ok(config.includes("const parts = child.value.split(child.value.includes('/') ? PATH_BREAK : MEMBER_BREAK);"), 'code wrap: a path breaks only at slashes');
  assert.ok(config.includes("tagName: 'wbr'"), 'code wrap: wbr element');
  const hook = config.slice(config.indexOf("name: 'medusapos:wrap-indent'"));
  assert.ok(hook.includes('addBreakPoints(node'), 'code wrap: called from the line hook');
  const split = (s) => s.split(s.includes('/') ? /(?<=\/)(?!\/)/ : /(?<=[\w$)\]]\.)(?=[A-Za-z_$])(?!(?:[cm]?[jt]sx?|json)\b)/);
  assert.deepEqual(split('process.env.LOCKING_REDIS_URL,'), ['process.', 'env.', 'LOCKING_REDIS_URL,'], 'code wrap: member chain splits before each name');
  assert.deepEqual(split('0.2.3'), ['0.2.3'], 'code wrap: version numbers stay whole');
  assert.deepEqual(split('@medusajs/medusa/locking'), ['@medusajs/', 'medusa/', 'locking'], 'code wrap: paths still split after each slash');
  assert.deepEqual(split('https://x'), ['https://', 'x'], 'code wrap: no break between the two slashes of //');
  assert.deepEqual(split('./node_modules/@medusapos/medusa-plugin/.medusa/server/src/scripts/tally-pos-roles.js'), ['./', 'node_modules/', '@medusapos/', 'medusa-plugin/', '.medusa/', 'server/', 'src/', 'scripts/', 'tally-pos-roles.js'], 'code wrap: a path keeps .medusa and .js whole');
  assert.deepEqual(split('medusa-config.ts'), ['medusa-config.ts'], 'code wrap: no break before a file extension');
  assert.deepEqual(split('...rest'), ['...rest'], 'code wrap: no break inside a spread');
  const css = readFileSync(new URL('../app/global.css', import.meta.url), 'utf8');
  assert.ok(css.includes('overflow-wrap: anywhere;'), 'code wrap: anywhere stays as the fallback');
});

test('Quick start walks through closing the register', () => {
  const qs = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  const close = qs.slice(qs.indexOf('At the end of the day'), qs.indexOf('You can keep selling from the loaded catalogue'));
  assert.ok(close.includes('1. Tap the register\'s state, as when you opened it, to open its panel, then tap **Close register**. On a phone, **Close register** is in the cart view.'), 'qs close: open the count');
  assert.ok(close.includes('2. Tap the note and coin tiles, or type the cash in the drawer.'), 'qs close: count');
  assert.ok(close.includes('3. Tap **Close register** again. The closure is your Z report') && close.includes('**Print the Z report**') && close.includes('**Done**'), 'qs close: Z report');
  assert.equal(qs.split('The closure is your Z report').length, 2, 'qs close: Z report said once');
  const registers = readFileSync(new URL('../content/docs/registers.mdx', import.meta.url), 'utf8');
  for (const label of ['**Close register**', '**Print the Z report**', '**Done**', 'Tap the note and coin tiles, or type the cash in the drawer.']) {
    assert.ok(registers.includes(label), `qs close: ${label} matches Registers`);
  }
  assert.ok(registers.includes('On a phone, this is in the cart view.'), 'qs close: Registers gives the same phone place');
  assert.ok(close.includes('On a phone, **Close register** is in the cart view.'), 'qs close: phone place matches Registers');
});

test('the optional RBAC section offers a skip to Sign in', () => {
  const qs = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  const access = qs.slice(qs.indexOf('## Choose who may use the POS'), qs.indexOf('## Sign in'));
  const first = access.split('\n\n').find((block) => block.startsWith('This is optional'));
  assert.ok(first && first.startsWith('This is optional: if every admin user may use the till, skip to\n[Sign in](#sign-in).'), 'rbac skip: first sentence links Sign in');
  assert.match(qs, /^## Sign in$/m, 'rbac skip: the anchor target exists');
});

test('the changelog intro agrees with the hosted-build paragraph', () => {
  const changelog = readFileSync(new URL('../content/docs/changelog.mdx', import.meta.url), 'utf8');
  assert.ok(!changelog.includes('Unreleased work is not listed.'), 'changelog intro: no blanket "not listed"');
  const intro = changelog.split('\n').find((line) => line.startsWith('Each entry follows the release note'));
  assert.ok(intro && intro.endsWith('Unreleased work gets no entry; the paragraph below says what the hosted app already has.'), 'changelog intro: points at the hosted-build paragraph');
  const hosted = changelog.indexOf('app.medusapos.com and the live demo run the app\'s latest build.');
  assert.ok(hosted > changelog.indexOf(intro) && hosted < changelog.indexOf('\n## '), 'changelog intro: the hosted-build paragraph follows, before the first entry');
});

test('the phone header shows a Docs link on the home and 404 pages', () => {
  const shared = readFileSync(new URL('../lib/layout.shared.tsx', import.meta.url), 'utf8');
  assert.ok(shared.includes('export function homeOptions(): BaseLayoutProps'), 'phone docs: helper');
  assert.ok(/href="\/docs"\s+className="sm:hidden inline-flex min-h-11 items-center/.test(shared), 'phone docs: phone only, 44 px tall');
  assert.ok(/href=\{siteConfig\.demoUrl\}\s+target="_blank"\s+rel="noreferrer noopener"\s+className="sm:hidden inline-flex min-h-11 items-center/.test(shared), 'phone demo: phone only, 44 px tall, new tab');
  assert.ok(shared.indexOf('>\n            Docs\n') < shared.indexOf('Live demo\n'), 'phone demo: after Docs');
  assert.ok(shared.includes("{ text: 'Docs', url: '/docs', active: 'none' },"), 'phone docs: nav link kept');
  for (const file of ['../app/(home)/layout.tsx', '../app/not-found.tsx']) {
    const src = readFileSync(new URL(file, import.meta.url), 'utf8');
    assert.ok(src.includes('<HomeLayout {...homeOptions()}>'), `phone docs: ${file}`);
  }
  const docs = readFileSync(new URL('../app/docs/layout.tsx', import.meta.url), 'utf8');
  assert.ok(!docs.includes('homeOptions'), 'phone docs: docs layout unchanged');
});

test("the 0.2.0 till bullets each lead with a bold label and a full stop", () => {
  const log = readFileSync(new URL('../content/docs/changelog.mdx', import.meta.url), 'utf8');
  const till = log.slice(log.indexOf("### What's new at the till"), log.indexOf('###', log.indexOf("### What's new at the till") + 4));
  const lines = till.split('\n').filter((line) => line.trim().startsWith('- '));
  assert.ok(lines.length >= 8, 'till bullets: found');
  assert.ok(lines.every((line) => line.startsWith('- **')), 'till bullets: no sub-bullets');
  assert.ok(lines.every((line) => /^- \*\*[^*]+\.\*\* \S/.test(line)), 'till bullets: bold label, full stop, then text');
  assert.ok(till.includes('- **Line prices.** Change a line\'s price at the till.'), 'till bullets: line price');
  assert.ok(till.includes("a one-off item to a sale. Your store records the fee") && till.includes('All are taxed at your region\'s rate. Medusa can\'t keep one charge tax-free'), 'till bullets: fees in one paragraph');
});

test('no docs link is a bare "why"', () => {
  for (const file of readdirSync(new URL('../content/docs/', import.meta.url)).filter((name) => name.endsWith('.mdx'))) {
    const src = readFileSync(new URL(`../content/docs/${file}`, import.meta.url), 'utf8');
    assert.ok(!/\[why\]\(/i.test(src), `why links: ${file}`);
  }
});

test('At the till says the Order note box does not reach the order', () => {
  const till = readFileSync(new URL('../content/docs/at-the-till.mdx', import.meta.url), 'utf8');
  const notYet = till.slice(till.indexOf('## Not yet'));
  assert.ok(notYet.includes('With plugin 0.2.3, a note typed in the **Order note** box doesn\'t reach the order, because the plugin doesn\'t accept notes.'), 'till order note: the line');
  assert.ok(notYet.includes('{/* Order note: limitations.mdx line 23'), 'till order note: source cited');
  const lim = readFileSync(new URL('../content/docs/limitations.mdx', import.meta.url), 'utf8');
  assert.ok(lim.includes('The hosted app shows an **Order note** box, but this plugin doesn\'t accept notes, so the note doesn\'t reach the order.'), 'till order note: Limitations says the same');
});

test('Registers names the register control as Quick start does', () => {
  const reg = readFileSync(new URL('../content/docs/registers.mdx', import.meta.url), 'utf8');
  assert.ok(!reg.includes('**Register ›**'), 'register name: no Register › in Registers');
  assert.ok(reg.includes("Tap the register's state to open its panel."), 'register name: open its panel');
  const qs = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  assert.ok(qs.includes("Tap the register's state, as when you opened it, to open its panel"), 'register name: quick start uses the same name');
});

test('At the till preloads only its first screenshot', () => {
  const mdx = readFileSync(new URL('../mdx-components.tsx', import.meta.url), 'utf8');
  assert.ok(mdx.includes('img: DocImage') && mdx.includes('{...({ ...props, preload } as ImageZoomProps)}'), 'preload: DocImage is the markdown image and passes preload');
  const till = readFileSync(new URL('../content/docs/at-the-till.mdx', import.meta.url), 'utf8');
  assert.equal(till.split('preload').length, 2, 'preload: once on At the till');
  assert.ok(till.includes("import tillPayment from '../../public/screenshots/docs/till-payment.jpg';"), 'preload: static import');
  const dir = new URL('../content/docs/', import.meta.url);
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.mdx') && f !== 'at-the-till.mdx')) {
    assert.ok(!readFileSync(new URL(file, dir), 'utf8').includes(' preload'), `preload: none on ${file}`);
  }
});

test('the receipt example right-aligns amounts and bolds the total', () => {
  const till = readFileSync(new URL('../content/docs/at-the-till.mdx', import.meta.url), 'utf8');
  const rec = till.slice(till.indexOf('## Read the receipt'), till.indexOf('## Print the receipt'));
  assert.ok(rec.includes('| Receipt line | Amount |\n| --- | ---: |\n'), 'receipt: amounts right-aligned');
  assert.ok(rec.includes('| **Total** | **€3.88** |'), 'receipt: total bold');
  for (const row of ['| 2 × €2.00 | €4.00 |', '| 10% off | −€0.40 |', '| Order discount | −€0.50 |', '| Subtotal | €4.00 |', '| Discount | −€0.90 |', '| VAT 25% | €0.78 |']) {
    assert.ok(rec.includes(row), `receipt: ${row}`);
  }
});

test('Quick start shows the Open register panel under step 1', () => {
  const qs = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  const sale = qs.slice(qs.indexOf('## Make a sale'), qs.indexOf('## Known beta limits'));
  const shot = '\n   ![The Open register panel: Cash in the drawer to start (€) with 100 typed in, above the Open register button](/screenshots/docs/quick-start-open-register.jpg)\n';
  assert.ok(sale.includes(shot), 'open register: indented image with alt text');
  assert.ok(sale.indexOf(shot) > sale.indexOf('till-register-control.jpg') && sale.indexOf(shot) < sale.indexOf('2. Scan a barcode'), 'open register: under step 1, after the header shot');
  assert.ok(sale.includes('{/* Screenshot: demo.medusapos.com/demo, Demo register closed, captured 2026-11-19'), 'open register: source');
  assert.ok(readFileSync(new URL('../public/screenshots/docs/quick-start-open-register.jpg', import.meta.url)).length > 20000, 'open register: file present');
});

test('Quick start sets up shared locking before the migration', () => {
  const qs = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  const install = qs.slice(qs.indexOf('## Install the plugin'), qs.indexOf('## Configure your store'));
  const lock = install.indexOf('If you run more than one Medusa instance, set up a shared locking provider\nfirst, as in [Plugin setup](/docs/plugin-setup#if-you-run-more-than-one-medusa-instance).');
  assert.ok(lock > install.indexOf('`shippingOptionId`'), 'locking: after the options');
  assert.ok(lock < install.indexOf("Then apply the plugin's database migrations"), 'locking: before the migration');
  assert.ok(install.trimEnd().endsWith('npx medusa db:migrate\n```'), 'locking: the section ends with the migration');
});

test('docs screenshots use the home page frame', () => {
  const mdx = readFileSync(new URL('../mdx-components.tsx', import.meta.url), 'utf8');
  const home = readFileSync(new URL('../app/(home)/page.tsx', import.meta.url), 'utf8');
  assert.ok(home.includes('rounded-xl border border-fd-border shadow-lg'), 'frame: home frame');
  assert.ok(mdx.includes('rounded-xl border border-fd-border shadow-lg'), 'frame: docs use it');
  assert.ok(mdx.includes("Framed like the home page's screenshots"), 'frame: comment');
});

test('on phones the hero fine print follows the screenshot', () => {
  const home = readFileSync(new URL('../app/(home)/page.tsx', import.meta.url), 'utf8');
  const hero = home.slice(home.indexOf('<section'), home.indexOf('</section>'));
  const figureEnd = hero.indexOf('</figure>');
  assert.ok(figureEnd > 0, 'fine print: hero has a figure');
  assert.ok(hero.indexOf('The live demo signs you in with one click') > figureEnd, 'fine print: demo note after the screenshot');
  assert.ok(hero.indexOf('Already installed? Staff start at') > figureEnd, 'fine print: staff line after the screenshot');
  assert.ok(hero.indexOf('Point of sale for Medusa') < figureEnd, 'fine print: heading stays before the screenshot');
  assert.ok(hero.includes('lg:col-start-1 lg:row-start-2'), 'fine print: under the buttons from lg');
  assert.ok(hero.includes('lg:row-span-2'), 'fine print: screenshot spans both rows from lg');
});

test('Limitations does not repeat its subtitle', () => {
  const lim = readFileSync(new URL('../content/docs/limitations.mdx', import.meta.url), 'utf8');
  assert.ok(lim.includes("description: What MedusaPOS doesn't do yet, and what it expects of your store and till."), 'limitations: subtitle');
  assert.match(lim, /^MedusaPOS is in beta\.$/m, 'limitations: intro is one sentence');
  assert.equal(lim.split("what it expects of your store and till").length, 2, 'limitations: said once');
});

test('Registers shows where and how to open the register', () => {
  const reg = readFileSync(new URL('../content/docs/registers.mdx', import.meta.url), 'utf8');
  const qs = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  const open = reg.slice(reg.indexOf('## Open with your float'), reg.indexOf('## Record cash in and out'));
  for (const file of ['till-register-control.jpg', 'quick-start-open-register.jpg']) {
    const line = qs.split('\n').map((l) => l.trim()).find((l) => l.startsWith('![') && l.includes(`/screenshots/docs/${file})`));
    assert.ok(line, `registers open: ${file} in quick start`);
    assert.ok(open.includes(line), `registers open: ${file} with the same alt text`);
  }
  assert.ok(open.indexOf('till-register-control.jpg') < open.indexOf('quick-start-open-register.jpg'), 'registers open: control before panel');
  assert.ok(open.indexOf('Tap it to choose or open the register.') < open.indexOf('till-register-control.jpg'), 'registers open: after the text');
});

test('Source on GitHub has a 44 px tap height', () => {
  const home = readFileSync(new URL('../app/(home)/page.tsx', import.meta.url), 'utf8');
  assert.ok(home.includes('<a href={siteConfig.githubUrl} className="py-2.5 underline">Source on GitHub</a>'), 'source: padded link');
});

test('Troubleshooting gives the full-screen saved-sales message its own section', () => {
  const tr = readFileSync(new URL('../content/docs/troubleshooting.mdx', import.meta.url), 'utf8');
  const banners = tr.slice(tr.indexOf('## Read the banners'), tr.indexOf('## "This account can\'t use the POS"'));
  assert.ok(!banners.includes("Saved sales can't be opened"), 'saved sales: not under banners');
  assert.match(tr, /^## Saved sales can't be opened$/m, 'saved sales: own H2');
  const i = tr.indexOf("## Saved sales can't be opened");
  assert.ok(tr.indexOf("## If a sale can't be saved") < i && i < tr.indexOf('## Storage messages'), 'saved sales: between the save and storage sections');
  assert.ok(tr.slice(i).includes('The full-screen message says "Saved sales can\'t be opened on this device.'), 'saved sales: text kept');
  assert.equal(tr.split("Saved sales can't be opened on this device").length, 2, 'saved sales: said once');
});

test('the hero states the offline condition', () => {
  const home = readFileSync(new URL('../app/(home)/page.tsx', import.meta.url), 'utf8');
  const features = readFileSync(new URL('../lib/features.ts', import.meta.url), 'utf8');
  assert.ok(home.includes('keeps selling when the connection drops as long as the tab stays open, and never records the same sale twice'), 'offline: hero condition');
  assert.ok(features.includes('when the connection drops, as long as the tab stays open.'), 'offline: card says the same');
});

test('the hero keeps the 2.21.0 requirement under the buttons', () => {
  const home = readFileSync(new URL('../app/(home)/page.tsx', import.meta.url), 'utf8');
  const hero = home.slice(home.indexOf('<section'), home.indexOf('</section>'));
  const figure = hero.indexOf('<figure');
  const req = hero.indexOf("The web app needs a store on{' '}");
  assert.ok(req > hero.indexOf('Quick start') && req < figure, 'requirement: under the buttons, before the screenshot');
  assert.ok(hero.indexOf('The live demo signs you in with one click and resets every night.\n') > hero.indexOf('</figure>'), 'requirement: demo note stays after the screenshot');
  assert.equal(hero.split('Medusa 2.21.0 exactly').length, 2, 'requirement: said once');
});

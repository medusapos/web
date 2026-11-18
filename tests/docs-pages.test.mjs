import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

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
  assert.ok(flat.includes('and access to its configuration. To check, run `npm ls @medusajs/medusa` in your backend\'s directory; on another version, move the store to 2.21.0 first.'), 'quick-start: version check');
});

test('home shows the phone screenshot at 320 px', () => {
  const home = readFileSync(new URL('../app/(home)/page.tsx', import.meta.url), 'utf8');
  assert.ok(home.includes('<section className="grid items-center gap-10 py-12 sm:py-16 md:grid-cols-[320px_1fr] lg:gap-16">'), 'home: phone section on the content edges, 320 px column');
  assert.ok(!home.includes('max-w-4xl'), 'home: no narrower phone section box');
  assert.ok(home.includes('<div className="hidden md:block w-[320px] max-w-full'), 'home: phone shot 320 px');
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
  assert.ok(quickStart.includes('Tap **Checkout**. The payment screen opens on **Cash**; tap **Card terminal**\nfor a card sale.'), 'quick-start: Checkout');
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
  assert.ok(quickStart.includes('- A store on Medusa 2.21.0 exactly ([why](/docs/limitations#store-setup-limits))'), 'quick-start: exact version');
  const home = readFileSync(new URL('../app/(home)/page.tsx', import.meta.url), 'utf8');
  assert.ok(home.includes('The demo store resets every night. The web app needs a store on Medusa 2.21.0 exactly, with the MedusaPOS plugin installed: a one-time job for whoever runs your Medusa backend.'), 'home: exact version');
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
  assert.ok(changelog.includes('Site note, November 2026: the 0.2.0 release notes list no fix for the large-catalogue sync.'), 'changelog: site note');
});

test('the quick start says the till shows only the channel\'s products', () => {
  const quickStart = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  assert.ok(/The till shows only the products in that sales channel, so add the\s+products you'll sell in person to it\./.test(quickStart), 'quick-start: channel products');
});

test('the quick start says to link one stock location', () => {
  const quickStart = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  assert.ok(/Link only that one stock location to the channel\s+\(\[why\]\(\/docs\/limitations#store-setup-limits\)\)\./.test(quickStart), 'quick-start: one location');
});

test('configure your store names the admin paths', () => {
  const qs = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  const configure = qs.slice(qs.indexOf('## Configure your store'), qs.indexOf('5. Create (or reuse) a publishable API key'));
  assert.ok(/\*\*Settings → Locations & Shipping\*\*, open the location, and edit its\s+\*\*Sales Channels\*\* section\./.test(configure), 'quick-start: location path');
  assert.ok(/[Cc]lick \*\*Create option\*\*\s+and choose the profile in the \*\*Shipping Profile\*\* field\./.test(configure), 'quick-start: shipping option path');
  assert.ok(/go to \*\*Settings → Tax\s+Regions\*\* and create a region for that country\./.test(configure), 'quick-start: tax path');
});

test('plugin setup shows the redis locking example one property per line', () => {
  const ps = readFileSync(new URL('../content/docs/plugin-setup.mdx', import.meta.url), 'utf8');
  assert.ok(ps.includes("    providers: [{\n      resolve: '@medusajs/medusa/locking-redis',\n      id: 'locking-redis',\n      is_default: true,\n"), 'plugin-setup: provider one property per line');
  assert.ok(ps.includes('        redisUrl: process.env.LOCKING_REDIS_URL,\n'), 'plugin-setup: redisUrl on its own line');
  assert.ok(!ps.includes("modules: [{ resolve:"), 'plugin-setup: no packed example');
  assert.ok(ps.includes("Set `LOCKING_REDIS_URL` in every instance's environment to the URL of the same Redis server."), 'plugin-setup: says to set LOCKING_REDIS_URL');
});

test('plugin setup shows the postgres locking example', () => {
  const ps = readFileSync(new URL('../content/docs/plugin-setup.mdx', import.meta.url), 'utf8');
  assert.ok(ps.includes("    providers: [{\n      resolve: '@medusajs/medusa/locking-postgres',\n      id: 'locking-postgres',\n      is_default: true,\n    }],\n"), 'locking: postgres block');
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
  for (const [page, name] of [[till, 'till-payment'], [close, 'registers-count'], [close, 'registers-closure']]) {
    assert.ok(new RegExp(`\\n   !\\[[^\\]]{40,}\\]\\(/screenshots/docs/${name}\\.jpg\\)\\n`).test(page), `${name}: indented image with alt text`);
    assert.ok(readFileSync(new URL(`../public/screenshots/docs/${name}.jpg`, import.meta.url)).length > 20000, `${name}: file present`);
  }
  assert.ok(till.indexOf('till-payment.jpg') > till.indexOf('2. Tap **Checkout**') && till.indexOf('till-payment.jpg') < till.indexOf('3. For cash'), 'till: shot under step 2');
  assert.ok(close.indexOf('registers-count.jpg') < close.indexOf('3. Tap **Close register** again'), 'registers: count shot under step 2');
  assert.ok(close.indexOf('registers-closure.jpg') < close.indexOf('4. Tap **Done**'), 'registers: closure shot under step 3');
  assert.ok(close.includes('4. Tap **Done**. The **Open register** panel now offers **Use the last counted cash**, with the amount you just counted.'), 'registers: step 4 names the button');
  assert.ok(close.includes("To keep a paper copy, tap **Print the Z report**; your browser's print dialog opens, as for receipts."), 'registers: print the Z report');
  assert.ok(close.indexOf('**Print the Z report**') < close.indexOf('4. Tap **Done**'), 'registers: print before Done');
  assert.ok(close.includes('register-close.tsx:212') && close.includes('closure-print.ts printHtml'), 'registers: print source cited');
  assert.ok(!reg.includes('open card'), 'registers: no open card');
  const mdx = readFileSync(new URL('../mdx-components.tsx', import.meta.url), 'utf8');
  assert.ok(mdx.includes('mx-auto w-full max-w-sm border border-fd-border'), 'mdx: framed, narrow screenshots');
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
  const step6 = qs.slice(qs.indexOf('6. If you do not have an admin user'), qs.indexOf('## Choose who may use the POS'));
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
  assert.ok(features.includes('then count and close. Closing with a large difference asks for a sign-in to approve it.'), 'approval: home card');
  assert.ok(!features.includes("cashier's own"), 'approval: caveat not on the card');
  assert.ok(intro.includes('count and close. Closing with a large difference asks for a sign-in to approve it.'), 'approval: introduction');
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
  const start = qs.indexOf('4. Make sure a region covers');
  assert.ok(start > qs.indexOf('## Configure your store'), 'region: step 4');
  const step = qs.slice(start, qs.indexOf('5. Create (or reuse) a publishable API key')).replace(/\s+/g, ' ');
  assert.ok(step.startsWith("4. Make sure a region covers the location's country, in the currency you sell in:"), 'region: step');
  assert.ok(step.includes('go to **Settings → Regions**; if no region lists that country, click **Create**, choose the **Currency** and add the country under **Countries**.'), 'region: admin path');
  assert.ok(step.includes("so give each product you'll sell in person a price in its currency."), 'region: prices');
  assert.ok(step.indexOf('**Settings → Regions**') < step.indexOf('**Settings → Tax Regions**'), 'region: before tax');
  assert.ok(!/inventory|stock level/i.test(step), 'region: no inventory claim');
  assert.ok(qs.includes('/user-guide/settings/regions ("Create", "Currency", "Countries")') && qs.includes('docs/testers.md (Set up this till'), 'region: sources cited');
});

test('the quick start splits steps 3 and 4 into substeps', () => {
  const qs = readFileSync(new URL('../content/docs/quick-start.mdx', import.meta.url), 'utf8');
  const three = qs.slice(qs.indexOf('3. Create a shipping option'), qs.indexOf('4. Make sure a region covers'));
  assert.ok(three.includes("On the location's page:\n   1. Enable **Pickup** (or **Shipping**).\n   2. Add a service zone"), 'substeps: step 3 opens its list');
  assert.ok(three.includes('\n   3. Click **Create option**'), 'substeps: step 3 ends with the option');
  const four = qs.slice(qs.indexOf('4. Make sure a region covers'), qs.indexOf('5. Create (or reuse) a publishable API key'));
  assert.ok(four.includes('sell in:\n   1. In the Medusa admin, go to **Settings → Regions**'), 'substeps: step 4 opens its list');
  assert.ok(four.includes('\n   3. Tax is set up separately: go to **Settings → Tax Regions**'), 'substeps: step 4 ends with tax');
});

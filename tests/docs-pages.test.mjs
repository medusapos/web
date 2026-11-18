import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('home shows the phone screenshot at 320 px', () => {
  const home = readFileSync(new URL('../app/(home)/page.tsx', import.meta.url), 'utf8');
  assert.ok(home.includes('<section className="mx-auto grid max-w-4xl items-center gap-10 py-12 sm:py-16 md:grid-cols-[320px_1fr]">'), 'home: phone section centred, 320 px column');
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
  assert.ok(quickStart.includes('Tap **Checkout**, choose **Cash** or **Card terminal**'), 'quick-start: Checkout');
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
  assert.ok(home.includes('The web app needs a store on Medusa 2.21.0 exactly, with the MedusaPOS plugin installed.'), 'home: exact version');
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

test('home links automated tests to the app CI workflow', () => {
  const home = readFileSync(new URL('../app/(home)/page.tsx', import.meta.url), 'utf8');
  assert.ok(home.includes('<a href={`${siteConfig.githubUrl}/actions/workflows/ci.yml`} className="underline">automated tests</a>'), 'home: tests link');
  assert.ok(!home.includes("automated tests, which run on every change"), 'home: no unlinked tests line');
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

import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { features, featureDocs } from '../lib/features.ts';
import { siteConfig } from '../lib/site.ts';

test('every feature cites at least one app test', () => {
  for (const feature of features) {
    assert.ok(feature.tests.length >= 1, feature.title);
    for (const path of feature.tests) {
      assert.match(path, /^(e2e|apps\/expo\/tests|packages\/medusa-plugin\/integration-tests)\/[\w./-]+\.(spec|test)\.tsx?$/);
    }
  }
});

test('feature titles are unique', () => {
  assert.equal(new Set(features.map((feature) => feature.title)).size, features.length);
});

test('every feature is in release 0.2.0', () => {
  for (const feature of features) {
    assert.equal(feature.released, true, feature.title);
  }
});

test('docs index and quick start link the live demo', () => {
  for (const name of ['index.mdx', 'quick-start.mdx']) {
    const source = readFileSync(new URL(`../content/docs/${name}`, import.meta.url), 'utf8');
    assert.ok(source.includes(siteConfig.demoUrl), name);
  }
});

test('home page renders the features list and the comparison table', () => {
  const source = readFileSync(new URL('../app/(home)/page.tsx', import.meta.url), 'utf8');
  assert.ok(source.includes('core.map(') && source.includes('more.map(') && source.includes('features.map('), 'home: both card groups and the table render');
  assert.ok(source.includes('scope="row"'));
});

test('Not there yet no longer lists split tender or customers', () => {
  const source = readFileSync(new URL('../app/(home)/page.tsx', import.meta.url), 'utf8');
  assert.ok(!source.includes('split one payment'));
  assert.ok(!source.includes('attach a customer'));
});

test('the counter or phone card opens with one device taking payment at a time', () => {
  const card = features.find((feature) => feature.title === 'Counter or phone');
  assert.ok(card, 'counter: card exists');
  assert.ok(card.description.startsWith('Each store has one register, so one device at a time takes payment: a counter screen or a phone. '), 'counter: limit and both devices first');
  assert.equal(card.description, 'Each store has one register, so one device at a time takes payment: a counter screen or a phone. To switch, close the register on one and open it on the other.', 'counter: how to switch');
  assert.ok(card.description.length <= Math.max(...features.filter((feature) => feature !== card).map((feature) => feature.description.length)), 'counter: not the longest card');
  assert.ok(!features.some((feature) => feature.title === 'Phone and counter'), 'counter: old title gone');
});

test('the feature lists include fees and one-off items', () => {
  const card = features.find((feature) => feature.title === 'Fees and one-off items');
  assert.ok(card, 'fees: card exists');
  assert.ok(card.description.startsWith("Add a bag fee, a delivery charge or a one-off item that isn't in your catalogue."), 'fees: card wording');
  assert.ok(card.tests.includes('packages/medusa-plugin/integration-tests/http/order-create-v5.spec.ts'), 'fees: plugin test cited');
  assert.equal(features.length % 6, 0, 'fees: rows are full at two and three columns');
  const intro = readFileSync(new URL('../content/docs/index.mdx', import.meta.url), 'utf8');
  assert.ok(intro.includes("- Adds a bag fee, a delivery charge or a one-off item that isn't in your catalogue ([At the till](/docs/at-the-till#fees-delivery-charges-and-one-off-items))."), 'fees: introduction');
  const till = readFileSync(new URL('../content/docs/at-the-till.mdx', import.meta.url), 'utf8');
  assert.ok(till.includes('## Fees, delivery charges and one-off items'), 'fees: anchor target exists');
});

test('the home page shows the three core cards first and larger', () => {
  assert.deepEqual(features.slice(0, 3).map((feature) => feature.title), ['Sells offline', 'Real Medusa orders', 'Cash and card terminal'], 'core: the first three cards');
  assert.equal(features.slice(3).length % 3, 0, 'core: the other cards fill rows of three');
  const source = readFileSync(new URL('../app/(home)/page.tsx', import.meta.url), 'utf8');
  assert.ok(source.includes('const core = features.slice(0, 3);') && source.includes('const more = features.slice(3);'), 'core: split');
  assert.ok(source.includes('<p className="mt-10 font-semibold">Also at the till</p>'), 'core: label before the others');
  assert.ok(source.indexOf('core.map(') < source.indexOf('Also at the till') && source.indexOf('Also at the till') < source.indexOf('more.map('), 'core: order');
  assert.ok(source.includes('<h3 className="text-lg font-semibold sm:mt-4 sm:text-xl">'), 'core: larger titles');
});

test('the Sells offline card says to keep the tab open', () => {
  const card = features.find((feature) => feature.title === 'Sells offline');
  assert.equal(card.description, "Keep selling from the loaded catalogue when the connection drops, as long as the tab stays open. Queued sales sync when you're back online, and Medusa never records one twice.", 'offline: what it does, with the tab condition');
  assert.equal(features[0], card, 'offline: still first');
});

test('on a phone the other home cards link to their docs', () => {
  const source = readFileSync(new URL('../app/(home)/page.tsx', import.meta.url), 'utf8');
  assert.ok(source.includes('<ul className="mt-4 grid gap-2 sm:hidden">'), 'phone list: one column below sm');
  assert.ok(source.includes('<div className="mt-4 hidden gap-3 sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">'), 'phone list: cards from sm up');
  assert.ok(source.indexOf('sm:hidden">') < source.indexOf('hidden gap-3 sm:grid'), 'phone list: before the cards');
  assert.ok(source.includes('className="flex h-full min-h-12 items-center'), 'phone list: tiles fill their row');
  assert.ok(/<\/span>\s*<ChevronRight size=\{16\} aria-hidden="true" className="ml-auto shrink-0 text-fd-muted-foreground" \/>\s*<\/Link>/.test(source), 'phone list: each tile ends with a chevron');
  assert.ok(source.includes('<span className="mt-0.5 block text-xs font-normal text-fd-muted-foreground">{feature.description}</span>'), 'phone list: each row has its whole description');
  assert.ok(!source.includes('feature.description.split('), 'phone list: no row is cut to its first sentence');
  for (const feature of features.slice(3)) {
    const href = featureDocs[feature.title];
    assert.ok(href, `phone list: ${feature.title} has a docs link`);
    const [path, anchor] = href.split('#');
    const file = new URL(`../content/docs/${path.replace('/docs/', '')}.mdx`, import.meta.url);
    assert.ok(existsSync(file), `phone list: ${href} page exists`);
    if (anchor) {
      const headings = readFileSync(file, 'utf8').split('\n').filter((line) => line.startsWith('## '));
      const slugs = headings.map((line) => line.slice(3).toLowerCase().replace(/[^a-z0-9 -]/g, '').trim().replace(/ +/g, '-'));
      assert.ok(slugs.includes(anchor), `phone list: ${href} heading exists`);
    }
  }
  assert.equal(Object.keys(featureDocs).length, features.length - 3, 'phone list: no stale entries');
});

test('phone list: one column, titles keep their hyphens whole', () => {
  const source = readFileSync(new URL('../app/(home)/page.tsx', import.meta.url), 'utf8');
  const list = source.slice(source.indexOf('sm:hidden">'), source.indexOf('hidden gap-3 sm:grid'));
  assert.ok(!list.includes('col-span-2') && !list.includes('grid-cols-2'), 'phone list: one column, no spanning tile');
  assert.ok(list.includes(String.raw`{feature.title.replace('-', '\u2011')}`), 'phone list: non-breaking hyphen');
  assert.equal(source.split(String.raw`'\u2011'`).length, 2, 'phone list: only the phone titles change');
});

test('Not there yet groups its twelve items under four labels', () => {
  const source = readFileSync(new URL('../app/(home)/page.tsx', import.meta.url), 'utf8');
  const block = source.slice(source.indexOf('id="not-there-yet"'), source.indexOf('for the full list.'));
  const labels = [...block.matchAll(/<h3 className="text-base font-semibold text-fd-foreground">([^<]+)<\/h3>/g)].map((m) => m[1]);
  assert.deepEqual(labels, ['Registers', 'Payments and receipts', 'Sales and sync', 'Sign-in and setup'], 'not there yet: four labels in order');
  assert.equal(block.split('<li>').length - 1, 12, 'not there yet: twelve items');
  assert.ok(!block.includes('list-disc space-y-2 pl-6 text-fd-muted-foreground'), 'not there yet: no single long list');
  const groups = block.split('<h3 ').slice(1);
  assert.ok(groups[0].includes('add or rename registers') && groups[0].includes('check who approves a large difference'), 'not there yet: registers group');
  assert.ok(groups[2].includes('send a batch of more than 50 sales') && groups[2].includes('reload or reopen while offline'), 'not there yet: sales and sync group');
  assert.ok(block.indexOf('{/* Batch limit:') < block.indexOf('send a batch of more than 50 sales') && block.indexOf('{/* Batch limit:') > block.indexOf('Sales and sync'), 'not there yet: source comment stays with its item');
});

test('Not there yet lays its four groups in two columns on a wide screen', () => {
  const source = readFileSync(new URL('../app/(home)/page.tsx', import.meta.url), 'utf8');
  const band = source.slice(source.indexOf('md:grid-cols-[320px_1fr]'), source.indexOf('for the full list.'));
  assert.ok(band.includes('<div className="mt-6 grid gap-x-10 gap-y-6 text-fd-muted-foreground lg:grid-cols-2">'), 'not there yet grid: two columns from lg');
  assert.ok(!band.includes('<div className="max-w-prose">'), 'not there yet grid: column not capped at prose width');
  assert.ok(band.includes('<div className="min-w-0">'), 'not there yet grid: column may shrink');
  assert.equal(band.split('<p className="mt-4 max-w-prose text-fd-muted-foreground">').length - 1, 3, 'not there yet grid: paragraphs keep the prose measure');
});

test('the split card has the name of its docs heading', () => {
  assert.ok(features.some((feature) => feature.title === 'Split payment'), 'split: card title');
  assert.ok(!features.some((feature) => feature.title === 'Split tender'), 'split: old title gone');
  assert.equal(featureDocs['Split payment'], '/docs/at-the-till#split-payment', 'split: docs link');
});

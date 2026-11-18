import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { features } from '../lib/features.ts';
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
  assert.ok(card.description.startsWith('Every store has one register, so one device at a time takes payment. '), 'counter: limit first');
  assert.ok(card.description.endsWith('with the cart a tap away.'), 'counter: both devices');
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

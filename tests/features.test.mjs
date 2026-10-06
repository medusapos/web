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

test('parked sales and line price edit are marked as not yet released', () => {
  for (const title of ['Parked sales', 'Line price edit']) {
    assert.equal(features.find((feature) => feature.title === title)?.released, false);
  }
  for (const feature of features.filter((feature) => !['Parked sales', 'Line price edit'].includes(feature.title))) {
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
  assert.ok(source.split('features.map(').length - 1 >= 2);
  assert.ok(source.includes('scope="row"'));
});

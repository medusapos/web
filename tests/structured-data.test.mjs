import test from 'node:test';
import assert from 'node:assert/strict';
import { siteConfig } from '../lib/site.ts';
import { homeJsonLd, breadcrumbJsonLd, serializeJsonLd } from '../lib/structured-data.ts';

test('home graph has Organization and SoftwareApplication', () => {
  const data = homeJsonLd(siteConfig);
  assert.equal(data['@context'], 'https://schema.org');
  assert.deepEqual(data['@graph'].map((node) => node['@type']), [
    'Organization',
    'SoftwareApplication',
  ]);
  const [organization, application] = data['@graph'];
  assert.equal(organization.url, 'https://medusapos.com');
  assert.equal(organization.logo, 'https://medusapos.com/icon.svg');
  assert.ok(organization.sameAs.includes('https://github.com/medusapos'));
  assert.equal(application.applicationCategory, 'BusinessApplication');
  assert.equal(application.operatingSystem, 'Web');
  assert.equal(application.license, 'https://opensource.org/licenses/MIT');
  assert.equal(application.publisher['@id'], organization['@id']);
});

test('home graph has no price or offers', () => {
  const forbidden = new Set(['offers', 'price', 'priceCurrency', 'aggregateRating']);
  function walk(value) {
    if (value === null || typeof value !== 'object') return;
    for (const [key, child] of Object.entries(value)) {
      assert.ok(!forbidden.has(key), `Unexpected property: ${key}`);
      walk(child);
    }
  }
  walk(homeJsonLd(siteConfig));
});

test('every node uses known schema.org properties', () => {
  // Each property is a real schema.org property of that type, so a typo fails the test.
  const allowed = {
    Organization: ['@type', '@id', 'name', 'url', 'logo', 'sameAs'],
    SoftwareApplication: [
      '@type', 'name', 'url', 'description', 'applicationCategory',
      'operatingSystem', 'license', 'sameAs', 'publisher',
    ],
    BreadcrumbList: ['@context', '@type', 'itemListElement'],
    ListItem: ['@type', 'position', 'name', 'item'],
  };
  function walk(value) {
    if (value === null || typeof value !== 'object') return;
    if (Object.hasOwn(value, '@type')) {
      const type = value['@type'];
      assert.ok(Object.hasOwn(allowed, type), `Unknown type: ${type}`);
      for (const key of Object.keys(value)) {
        assert.ok(allowed[type].includes(key), `Unknown ${type} property: ${key}`);
      }
    }
    for (const child of Object.values(value)) walk(child);
  }
  walk(homeJsonLd(siteConfig));
  walk(breadcrumbJsonLd(siteConfig, [
    { name: 'Home', path: '/' },
    { name: 'Docs', path: '/docs' },
  ]));
});

test('breadcrumbs are numbered from 1 with absolute URLs', () => {
  const data = breadcrumbJsonLd(siteConfig, [
    { name: 'Home', path: '/' },
    { name: 'Docs', path: '/docs' },
    { name: 'Quick start', path: '/docs/quick-start' },
  ]);
  assert.equal(data['@type'], 'BreadcrumbList');
  assert.deepEqual(data.itemListElement.map((item) => item.position), [1, 2, 3]);
  assert.deepEqual(data.itemListElement.map((item) => item.item), [
    'https://medusapos.com/',
    'https://medusapos.com/docs',
    'https://medusapos.com/docs/quick-start',
  ]);
});

test('serialised JSON-LD cannot close the script tag', () => {
  const original = { name: '</script><script>alert(1)</script>' };
  const serialized = serializeJsonLd(original);
  assert.ok(!serialized.includes('<'));
  assert.deepEqual(JSON.parse(serialized), original);
});

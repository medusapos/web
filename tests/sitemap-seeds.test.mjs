import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { sitemapSeeds } from '../scripts/sitemap-seeds.mjs';

const fixture = `<urlset>
  <url><loc>https://medusapos.com</loc></url>
  <url><loc>https://medusapos.com/docs</loc></url>
  <url><loc>https://medusapos.com/docs/quick-start</loc></url>
</urlset>`;

test('sitemap seeds start with / and rewrite every loc to the local origin', () => {
  assert.deepEqual(sitemapSeeds(fixture), [
    { source: '/', url: 'http://localhost:3000/' },
    { source: 'sitemap', url: 'http://localhost:3000/' },
    { source: 'sitemap', url: 'http://localhost:3000/docs' },
    { source: 'sitemap', url: 'http://localhost:3000/docs/quick-start' },
  ]);
});

test('empty and non-sitemap input throws', () => {
  assert.throws(() => sitemapSeeds('<urlset></urlset>'), /sitemap/);
  assert.throws(() => sitemapSeeds('<html></html>'), /sitemap/);
});

test('CLI rejects empty sitemaps and prints fixture seeds', (t) => {
  const directory = mkdtempSync(join(tmpdir(), 'sitemap-seeds-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const file = join(directory, 'sitemap.xml');
  writeFileSync(file, '<urlset></urlset>');
  const empty = spawnSync(process.execPath, ['scripts/sitemap-seeds.mjs', file], {
    encoding: 'utf8',
  });
  assert.notEqual(empty.status, 0);
  writeFileSync(file, fixture);
  const result = spawnSync(process.execPath, ['scripts/sitemap-seeds.mjs', file], {
    encoding: 'utf8',
  });
  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim().split('\n').length, 4);
  assert.ok(result.stderr.includes('seed (/): http://localhost:3000/'));
  assert.ok(result.stderr.includes('seed (sitemap): http://localhost:3000/docs/quick-start'));
});

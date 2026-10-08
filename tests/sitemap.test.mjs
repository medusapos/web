import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { PAGE_DATE_FALLBACK } from '../lib/page-dates.ts';

const sitemap = readFileSync('.next/server/app/sitemap.xml.body', 'utf8');
const blocks = sitemap.match(/<url>[\s\S]*?<\/url>/g) ?? [];

test('every sitemap url has one lastmod', () => {
  assert.equal(blocks.length, 9);
  for (const block of blocks) {
    assert.equal((block.match(/<lastmod>/g) ?? []).length, 1);
  }
});

test('quick-start lastmod is its source file\'s last commit', () => {
  const shallow = execFileSync('git', ['rev-parse', '--is-shallow-repository'], {
    encoding: 'utf8',
  }).trim();
  assert.equal(shallow, 'false', 'the sitemap test needs full git history (fetch-depth: 0)');
  const block = blocks.find((entry) =>
    entry.includes('<loc>https://medusapos.com/docs/quick-start</loc>'));
  assert.ok(block);
  const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
  const date = execFileSync('git', [
    'log', '-1', '--format=%cI', '--', 'content/docs/quick-start.mdx',
  ], { encoding: 'utf8' }).trim();
  assert.equal(lastmod, date);
});

test('every lastmod is its source file\'s last commit', () => {
  for (const block of blocks) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
    const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
    const file = loc === 'https://medusapos.com'
      ? 'app/(home)/page.tsx'
      : loc === 'https://medusapos.com/docs'
        ? 'content/docs/index.mdx'
        : `content/docs/${loc?.replace('https://medusapos.com/docs/', '')}.mdx`;
    assert.ok(Object.hasOwn(PAGE_DATE_FALLBACK, file), `unmapped sitemap loc: ${loc}`);
    const date = execFileSync('git', [
      'log', '-1', '--format=%cI', '--', file,
    ], { encoding: 'utf8' }).trim();
    assert.equal(lastmod, date);
  }
});

test('the shallow-clone fallback covers every page', () => {
  const files = [
    'app/(home)/page.tsx',
    ...readdirSync('content/docs')
      .filter((name) => name.endsWith('.mdx'))
      .map((name) => `content/docs/${name}`),
  ];
  assert.deepEqual(Object.keys(PAGE_DATE_FALLBACK).sort(), files.sort());
});

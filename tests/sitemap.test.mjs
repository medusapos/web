import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { PAGE_DATE_FALLBACK, pageLastModified } from '../lib/page-dates.ts';

const sitemap = readFileSync('.next/server/app/sitemap.xml.body', 'utf8');
const blocks = sitemap.match(/<url>[\s\S]*?<\/url>/g) ?? [];

test('every sitemap url has one lastmod', () => {
  assert.equal(blocks.length, 9);
  for (const block of blocks) {
    assert.equal((block.match(/<lastmod>/g) ?? []).length, 1);
  }
});

test('quick-start lastmod is its source file\'s last commit', () => {
  const block = blocks.find((entry) =>
    entry.includes('<loc>https://medusapos.com/docs/quick-start</loc>'));
  assert.ok(block);
  const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
  assert.equal(lastmod, pageLastModified('content/docs/quick-start.mdx'));
  const shallow = execFileSync('git', ['rev-parse', '--is-shallow-repository'], {
    encoding: 'utf8',
  }).trim();
  if (shallow === 'false') {
    const date = execFileSync('git', [
      'log', '-1', '--format=%cI', '--', 'content/docs/quick-start.mdx',
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

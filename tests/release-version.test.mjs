import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const match = readFileSync('lib/site.ts', 'utf8').match(/release: '(\d+\.\d+\.\d+)',/);
assert.ok(match);
const release = match[1];

test("the changelog's newest entry is the site release", () => {
  const newest = readFileSync('content/docs/changelog.mdx', 'utf8').match(/^## (\d+\.\d+\.\d+)/m);
  assert.ok(newest);
  assert.equal(newest[1], release);
});

test('the docs index and plugin setup name the release', () => {
  for (const file of ['index.mdx', 'plugin-setup.mdx']) {
    const text = readFileSync(`content/docs/${file}`, 'utf8');
    assert.ok(text.includes(`v${release}`), file);
  }
});

test('the prerendered home page shows the release', () => {
  const html = readFileSync('.next/server/app/index.html', 'utf8');
  assert.ok(html.includes(`version ${release}`));
});

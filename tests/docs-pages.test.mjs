import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

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

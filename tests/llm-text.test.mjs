import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripMdxComments } from '../lib/llm-text.ts';

test('strips single-line page comments and the blank lines after them', () => {
  const input = 'intro\n\n{/* Source: a */}\n\n{/* Also: b */}\n\nbody\n';
  assert.equal(stripMdxComments(input), 'intro\n\nbody\n');
});

test('strips a multi-line page comment', () => {
  const input = 'a\n\n{/* line one\nline two */}\n\nb\n';
  assert.equal(stripMdxComments(input), 'a\n\nb\n');
});

test('leaves fenced code untouched', () => {
  for (const input of [
    '```mdx\n{/* keep */}\n```\n',
    '  ~~~mdx\r\n```\r\n{/* keep */}\r\n  ~~~\r\n',
  ]) {
    assert.equal(stripMdxComments(input), input);
  }
});

test('leaves text without comments unchanged', () => {
  const input = 'A paragraph.\n\n# A heading\n';
  assert.equal(stripMdxComments(input), input);
});

test('built LLM outputs carry no page comments', () => {
  const full = readFileSync('.next/server/app/llms-full.txt.body', 'utf8');
  const slugs = ['at-the-till', 'limitations', 'plugin-setup', 'registers', 'troubleshooting'];
  const outputs = [full, ...slugs.map((slug) =>
    readFileSync(`.next/server/app/llms.mdx/docs/${slug}.body`, 'utf8'))];
  for (const output of outputs) {
    assert.ok(!output.includes('{/*'));
    assert.ok(!output.includes('Source: medusapos/app@'));
  }
  assert.ok(full.includes('# At the till'));
  assert.ok(full.includes('# Limitations'));
});

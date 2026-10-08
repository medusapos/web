// Marketing backlog item 92: rewrite production locs because CI checks the local build.
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const DEFAULT_SITEMAP = '.next/server/app/sitemap.xml.body';
export const DEFAULT_ORIGIN = 'http://localhost:3000';

export function sitemapSeeds(xml, origin = DEFAULT_ORIGIN) {
  const locs = [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)];
  if (!/<urlset\b/.test(xml) || locs.length === 0) {
    throw new Error('sitemap must contain a urlset with loc entries');
  }
  return [
    { source: '/', url: new URL('/', origin).href },
    ...locs.map((match) => {
      const loc = new URL(match[1].trim());
      return { source: 'sitemap', url: new URL(loc.pathname + loc.search, origin).href };
    }),
  ];
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const sitemapPath = process.argv[2] ?? DEFAULT_SITEMAP;
  const origin = process.argv[3] ?? DEFAULT_ORIGIN;
  const seeds = sitemapSeeds(readFileSync(sitemapPath, 'utf8'), origin);
  for (const seed of seeds) {
    console.error(`seed (${seed.source}): ${seed.url}`);
  }
  console.error(`${seeds.length} link-check seeds`);
  console.log(seeds.map((seed) => seed.url).join('\n'));
}

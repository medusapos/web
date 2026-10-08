import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

// Sitemap lastmod is each page source's last git commit (marketing backlog item 86).
// Shallow clones (CI, Vercel) cannot see that commit, so they use this map.
// Each value is the file's git log -1 --format=%cI on a full clone, checked 2026-10-08.
// Bump the value when the page changes.
export const PAGE_DATE_FALLBACK: Record<string, string> = {
  'app/(home)/page.tsx': '2026-10-07T16:46:29+02:00',
  'content/docs/at-the-till.mdx': '2026-10-07T16:46:29+02:00',
  'content/docs/changelog.mdx': '2026-10-07T16:46:29+02:00',
  'content/docs/index.mdx': '2026-10-07T16:46:29+02:00',
  'content/docs/limitations.mdx': '2026-10-07T16:46:29+02:00',
  'content/docs/plugin-setup.mdx': '2026-10-07T16:46:29+02:00',
  'content/docs/quick-start.mdx': '2026-10-07T16:46:29+02:00',
  'content/docs/registers.mdx': '2026-10-07T16:46:29+02:00',
  'content/docs/troubleshooting.mdx': '2026-10-07T16:46:29+02:00',
};

function gitOutput(args: string[]): string {
  try {
    return execFileSync('git', args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return '';
  }
}

export function pageLastModified(file: string): string | undefined {
  const [hash, date] = gitOutput(['log', '-1', '--format=%H %cI', '--', file]).split(' ');
  const shallowPath = gitOutput(['rev-parse', '--git-path', 'shallow']);
  const boundaryHashes = existsSync(shallowPath)
    ? readFileSync(shallowPath, 'utf8').split('\n')
    : [];
  return date && !boundaryHashes.includes(hash) ? date : PAGE_DATE_FALLBACK[file];
}

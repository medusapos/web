import { siteConfig } from '@/lib/site';
import { source } from '@/lib/source';

export const revalidate = false;

export async function GET() {
  const lines: string[] = [];
  lines.push(`# ${siteConfig.name}`);
  lines.push('');
  lines.push(`> ${siteConfig.description}`);
  lines.push('');
  lines.push(`- [${siteConfig.name}](${new URL('/', siteConfig.url).toString()}): ${siteConfig.description}`);
  for (const page of source.getPages()) {
    lines.push(`- [${page.data.title}](${new URL(page.url, siteConfig.url).toString()}): ${page.data.description}`);
  }
  lines.push(`- [Full documentation](${new URL('/llms-full.txt', siteConfig.url).toString()})`);
  return new Response(lines.join('\n'));
}

import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  // Sidebar links fetch on click, so first load does not prefetch every docs page.
  return (
    <DocsLayout tree={source.getPageTree()} {...baseOptions()} sidebar={{ prefetch: false }}>
      {/* DocsPage renders no <main>; display: contents keeps its children in DocsLayout's grid. */}
      <main className="contents">{children}</main>
    </DocsLayout>
  );
}

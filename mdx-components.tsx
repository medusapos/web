import defaultMdxComponents from 'fumadocs-ui/mdx';
import { ImageZoom, type ImageZoomProps } from 'fumadocs-ui/components/image-zoom';
import type { ComponentProps } from 'react';
import type { MDXComponents } from 'mdx/types';

function DocImage({ preload, ...props }: ComponentProps<'img'> & { preload?: boolean }) {
  // remark-image passes src as the static import, which carries the size.
  const src = props.src as unknown as { width?: number } | string | undefined;
  const width = typeof src === 'object' && src ? Number(src.width) : Number(props.width);
  return (
    <span className="block">
      {/* fumadocs's ImageProps type lacks preload; its Image spreads every prop to next/image. */}
      <ImageZoom
        {...({ ...props, preload } as ImageZoomProps)}
        className="mx-auto w-full rounded-xl border border-fd-border shadow-lg"
        style={{ maxWidth: width > 0 ? width / 2 : undefined }}
      />
      <span aria-hidden="true" className="-mt-6 block text-center text-xs text-fd-muted-foreground sm:hidden">
        Tap to enlarge
      </span>
    </span>
  );
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    // Docs screenshots are captured at device scale 2. Each shows at half its
    // pixel width, the app's own size, so every shot shares one scale; in a
    // narrower column it fills the width.
    // Framed like the home page's screenshots (rounded, with a shadow) and
    // centred, and a click or
    // tap opens it full size. Below 640 px a muted line under each one says a
    // tap opens it. A page can write `<DocImage … preload />` for a screenshot
    // in its first screen.
    img: DocImage,
    DocImage,
    ...components,
  };
}

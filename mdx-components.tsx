import defaultMdxComponents from 'fumadocs-ui/mdx';
import { ImageZoom, type ImageZoomProps } from 'fumadocs-ui/components/image-zoom';
import type { MDXComponents } from 'mdx/types';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    // Docs screenshots show one app pane each: framed, centred, at most 24rem
    // wide (28rem from lg up), and a click or tap opens them full size.
    img: (props) => <ImageZoom {...(props as ImageZoomProps)} className="mx-auto w-full max-w-sm border border-fd-border lg:max-w-md" />,
    ...components,
  };
}

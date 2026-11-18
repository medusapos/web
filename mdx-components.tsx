import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

const DefaultImg = defaultMdxComponents.img;

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    // Docs screenshots show one app pane each: framed, centred and at most
    // 24rem wide, so they stay legible without filling the column.
    img: (props) => <DefaultImg {...props} className="mx-auto w-full max-w-sm border border-fd-border" />,
    ...components,
  };
}

import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins';

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      // fumadocs' default themes, restated because the options type requires them.
      themes: { light: 'github-light', dark: 'github-dark' },
      // github-light's red, grey, orange and green fall below WCAG AA (4.5:1) on the
      // code-block background (#f1f1f1); swap in GitHub Primer's darker shades of the same hues.
      colorReplacements: {
        'github-light': {
          '#d73a49': '#cf222e',
          '#6a737d': '#57606a',
          '#e36209': '#953800',
          '#22863a': '#116329',
        },
      },
      // Fumadocs' defaults (notation highlight, word highlight, diff, focus) are kept;
      // setting transformers replaces them otherwise. wrap-indent gives each line
      // --wrap-indent = its leading spaces + 2ch, so a soft-wrapped continuation
      // (app/global.css wraps code blocks) starts deeper than the line's own text.
      transformers: [
        ...(rehypeCodeDefaultOptions.transformers ?? []),
        {
          name: 'medusapos:wrap-indent',
          line(node, line) {
            const text = this.source.split('\n')[line - 1] ?? '';
            const indent = text.length - text.trimStart().length;
            node.properties.style = `--wrap-indent:${indent + 2}ch`;
          },
        },
      ],
    },
  },
});

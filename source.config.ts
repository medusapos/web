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

type HastNode = { type: string; value?: string; tagName?: string; properties?: Record<string, unknown>; children?: HastNode[] };

// A <wbr> lets a long code line wrap at a sensible place on a phone instead
// of mid-word. Text holding a '/' is a path: it breaks after each '/' that
// isn't followed by another '/', so ./node_modules/x/.medusa/y.js wraps only
// between folders. Other text breaks after a '.' that follows a name and
// starts one (process.env.LOCKING_REDIS_URL), but not before a file
// extension (medusa-config.ts), in a version (0.2.3) or in '...'.
// <wbr> adds no text: the copy button copies the code unchanged. A short run
// holding a hyphen between two letters or digits is kept on one row (see
// keepHyphenRuns).
const PATH_BREAK = /(?<=\/)(?!\/)/;
const MEMBER_BREAK = /(?<=[\w$)\]]\.)(?=[A-Za-z_$])(?!(?:[cm]?[jt]sx?|json)\b)/;
const HYPHEN_RUN = /([^\s/]*[A-Za-z0-9]-[A-Za-z0-9][^\s/]*)/;
// A run of up to 32 characters with no space or slash that holds a hyphen
// between two letters or digits (medusa-plugin@0.2.3, tally-pos-roles.js)
// goes in a nowrap span, so the browser doesn't break it at the hyphen.
// A longer run is left alone and can still wrap.
function keepHyphenRuns(value: string): HastNode[] {
  return value
    .split(HYPHEN_RUN)
    .filter((piece) => piece !== '')
    .map((piece) =>
      HYPHEN_RUN.test(piece) && piece.length <= 32 && !/[\s/]/.test(piece)
        ? { type: 'element', tagName: 'span', properties: { style: 'white-space:nowrap' }, children: [{ type: 'text', value: piece }] }
        : { type: 'text', value: piece },
    );
}
function addBreakPoints(node: HastNode) {
  if (!node.children) return;
  node.children = node.children.flatMap((child) => {
    if (child.type !== 'text' || child.value === undefined || !/[/.-]/.test(child.value)) {
      addBreakPoints(child);
      return [child];
    }
    const parts = child.value.split(child.value.includes('/') ? PATH_BREAK : MEMBER_BREAK);
    return parts.flatMap((part, i) => [
      ...keepHyphenRuns(part),
      ...(i < parts.length - 1 ? [{ type: 'element', tagName: 'wbr', properties: {}, children: [] }] : []),
    ]);
  });
}

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
            addBreakPoints(node as HastNode);
          },
        },
      ],
    },
  },
});

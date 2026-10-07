// Page comments are maintainer source notes, not content.
export function stripMdxComments(markdown: string): string {
  let result = '';
  let fence = '';
  let inComment = false;
  let skipBlank = false;

  for (const [line] of markdown.matchAll(/[^\r\n]*(?:\r\n|\r|\n|$)/g)) {
    const text = line.trim();
    if (!fence && (inComment || /^[ \t]*\{\/\*/.test(line))) {
      inComment = !line.trimEnd().endsWith('*/}');
      skipBlank = true;
      continue;
    }
    if (skipBlank && !text) continue;
    skipBlank = false;

    const marker = text.match(/^(`{3}|~{3})/)?.[0][0];
    if (marker && (!fence || fence === marker)) {
      fence = fence ? '' : marker;
    }
    result += line;
  }

  return result;
}

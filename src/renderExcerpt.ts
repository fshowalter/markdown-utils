import { markdownToHtml } from "satteri";

import { MARKDOWN_FEATURES } from "./features.js";
import { removeFootnotes } from "./plugins/removeFootnotes.js";
import { smartDashes } from "./plugins/smartDashes.js";
import { trimToExcerpt } from "./plugins/trimToExcerpt.js";

/**
 * Excerpt HTML pipeline — footnotes stripped, trimmed to the first paragraph.
 *
 * A non-blank `synopsis` frontmatter entry wins over the body. Both are rendered
 * through the same pipeline, so a synopsis gets the same typography as prose.
 */
export function renderExcerpt(
  frontmatter: Record<string, unknown>,
  source: string,
): string {
  const excerptSource =
    (frontmatter.synopsis as string | undefined)?.trim() || source;

  return markdownToHtml(excerptSource, {
    features: MARKDOWN_FEATURES,
    mdastPlugins: [smartDashes, removeFootnotes, trimToExcerpt],
  }).html.trimEnd();
}

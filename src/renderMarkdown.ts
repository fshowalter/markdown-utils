import { markdownToHtml } from "satteri";

import { MARKDOWN_FEATURES } from "./features.js";
import { smartDashes } from "./plugins/smartDashes.js";

/**
 * Full block HTML pipeline — footnotes rendered, raw spans intact,
 * linkReviewedTitles not applied (that happens in the render layer).
 *
 * Frontmatter is skipped by the parser, so this accepts a whole file.
 */
export function renderMarkdown(source: string): string {
  return markdownToHtml(source, {
    features: MARKDOWN_FEATURES,
    mdastPlugins: [smartDashes],
    // AIDEV-NOTE: Sätteri terminates its output with a newline; remark did not.
    // Trim it so stored HTML stays byte-comparable and inline uses don't gain a
    // stray space.
  }).html.trimEnd();
}

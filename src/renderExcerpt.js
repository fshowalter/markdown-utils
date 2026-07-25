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
 *
 * @param {Record<string, unknown>} frontmatter
 * @param {string} source
 * @returns {string}
 */
export function renderExcerpt(frontmatter, source) {
  const excerptSource =
    /** @type {string | undefined} */ (frontmatter.synopsis)?.trim() || source;

  return markdownToHtml(excerptSource, {
    features: MARKDOWN_FEATURES,
    mdastPlugins: [smartDashes, removeFootnotes, trimToExcerpt],
  }).html.trimEnd();
}

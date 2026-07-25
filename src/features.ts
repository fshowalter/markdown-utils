import type { Features } from "satteri";

/**
 * Parser features shared by every pipeline.
 *
 * AIDEV-NOTE: `smartPunctuation.dashes` is deliberately OFF. Sätteri's dash
 * handling is pulldown-cmark's, which maps `--` to an EN dash. 66 content files
 * use `--` as an EM dash, matching remark-smartypants' `dashes: true`. The
 * `smartDashes` plugin reproduces that instead. Quotes and ellipses are native
 * because they match remark exactly (and pair quotes across inline elements).
 */
export const MARKDOWN_FEATURES: Features = {
  frontmatter: true,
  // U+FE0E forces the text presentation of the arrow rather than an emoji.
  gfm: { footnotes: { backContent: "↩\u{FE0E}" } },
  smartPunctuation: { dashes: false, ellipses: true, quotes: true },
};

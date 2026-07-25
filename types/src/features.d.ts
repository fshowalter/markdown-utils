/** @import { Features } from "satteri" */
/**
 * Parser features shared by every pipeline.
 *
 * AIDEV-NOTE: `smartPunctuation.dashes` is deliberately OFF. Sätteri's dash
 * handling is pulldown-cmark's, which maps `--` to an EN dash. 66 content files
 * use `--` as an EM dash, matching remark-smartypants' `dashes: true`. The
 * `smartDashes` plugin reproduces that instead. Quotes and ellipses are native
 * because they match remark exactly (and pair quotes across inline elements).
 *
 * @type {Features}
 */
export const MARKDOWN_FEATURES: Features;
import type { Features } from "satteri";
//# sourceMappingURL=features.d.ts.map
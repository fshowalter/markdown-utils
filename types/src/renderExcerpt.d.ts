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
export function renderExcerpt(frontmatter: Record<string, unknown>, source: string): string;
//# sourceMappingURL=renderExcerpt.d.ts.map
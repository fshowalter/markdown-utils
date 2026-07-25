import { load } from "js-yaml";
import { markdownToMdast } from "satteri";

import { MARKDOWN_FEATURES } from "./features.js";

/**
 * Reads the YAML frontmatter block from a markdown file.
 *
 * AIDEV-NOTE: Sätteri locates the `---` fence but hands back the block as a raw
 * string, so js-yaml still does the parsing. It does not return a body — nothing
 * reads one, and every pipeline takes the whole file because the parser skips
 * frontmatter when rendering.
 *
 * This is stricter than the regex it replaces: the fence must open on line 1, so
 * a leading BOM or blank line is no longer tolerated. All 286 content files
 * already satisfy that, and a file that doesn't now fails loudly.
 *
 * js-yaml leaves timestamps as strings; the collection schemas coerce them with
 * z.coerce.date().
 *
 * @param {string} source
 * @param {string} filePath
 * @returns {Record<string, unknown>}
 */
export function parseFrontmatter(source, filePath) {
  const tree = markdownToMdast(source, { features: MARKDOWN_FEATURES });
  const [firstChild] = "children" in tree ? tree.children : [];

  if (firstChild?.type !== "yaml") {
    throw new Error(`Frontmatter not found in ${filePath}`);
  }

  return /** @type {Record<string, unknown>} */ (load(firstChild.value));
}

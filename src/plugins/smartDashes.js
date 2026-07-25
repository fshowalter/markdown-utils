import { defineMdastPlugin } from "satteri";

// AIDEV-NOTE: Reproduces remark-smartypants' `dashes: true` behaviour, which maps
// exactly two dashes to an em dash and leaves longer runs alone. (Its `---` to en
// dash mapping is the separate `'inverted'` option, which this project never used.)
// The lookarounds are what keep `---` and `----` untouched.
//
// Sätteri's own `smartPunctuation.dashes` is off because it maps `--` to an EN
// dash; see MARKDOWN_FEATURES.
const DOUBLE_DASH = /(?<!-)--(?!-)/gu;

/**
 * Exported separately from the plugin because extractPlainText walks
 * `markdownToMdast` output, which never runs plugins, and so has to apply the
 * substitution itself.
 *
 * @param {string} value
 * @returns {string}
 */
export function applySmartDashes(value) {
  return value.replaceAll(DOUBLE_DASH, "—");
}

/** Applies {@link applySmartDashes} to text nodes. Text nodes exclude code, so
 *  inline code and fenced blocks are left verbatim. */
export const smartDashes = defineMdastPlugin({
  name: "smart-dashes",
  text(node, ctx) {
    const value = applySmartDashes(node.value);

    if (value !== node.value) {
      ctx.setProperty(node, "value", value);
    }
  },
});

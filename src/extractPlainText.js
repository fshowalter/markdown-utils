import { markdownToMdast } from "satteri";

import { MARKDOWN_FEATURES } from "./features.js";
import { applySmartDashes } from "./plugins/smartDashes.js";

/** @import { MdastNode } from "satteri" */

/**
 * Flattens markdown to plain text, replacing `strip-markdown`.
 *
 * AIDEV-NOTE: The output shape is load-bearing — renderAsPlainText slices it to
 * a character ceiling. It reproduces strip-markdown: every
 * paragraph and heading becomes a block (including ones nested in lists and
 * blockquotes), blocks are joined with a blank line, and a trailing newline is
 * appended when there is any content at all.
 *
 * Plugins do not run under `markdownToMdast`, so the dash substitution is applied
 * here directly rather than via the smartDashes plugin. Smart quotes and ellipses
 * are parser features and so are already present in the tree.
 */

/** Smart quotes wrapped around underscore emphasis, matching the parser's own. */
const LEFT_QUOTE = "\u{201C}";
const RIGHT_QUOTE = "\u{201D}";

/** Blocks that contribute no text of their own and whose contents are discarded. */
const SKIPPED_TYPES = new Set([
  "code",
  "definition",
  "footnoteDefinition",
  "html",
  "thematicBreak",
  "toml",
  "yaml",
]);

/**
 * @typedef {object} ExtractPlainTextOptions
 * @property {boolean} [quoteUnderscoreEmphasis] Wrap `_underscore emphasis_` in
 *   smart double quotes instead of dropping the markers. Asterisk emphasis is
 *   left alone, so `_The Shining_` reads as a title while `*very*` does not.
 */

/**
 * @param {string} source
 * @param {ExtractPlainTextOptions} [options]
 * @returns {string}
 */
export function extractPlainText(source, options = {}) {
  /** @type {string[]} */
  const blocks = [];

  collectBlocks(markdownToMdast(source, { features: MARKDOWN_FEATURES }), {
    blocks,
    // AIDEV-NOTE: Sätteri's offsets count code points, not UTF-16 code units, so
    // an astral character earlier in the source shifts every later `source[i]`.
    // Indexing this array instead keeps the marker lookup honest.
    characters: options.quoteUnderscoreEmphasis ? [...source] : undefined,
  });

  return blocks.length > 0 ? `${blocks.join("\n\n")}\n` : "";
}

/**
 * @typedef {object} WalkContext
 * @property {string[]} blocks Blocks collected so far.
 * @property {string[] | undefined} characters The source as code points, present
 *   only when underscore emphasis is being quoted.
 */

/**
 * @param {MdastNode} node
 * @param {WalkContext} context
 * @returns {string}
 */
function childrenText(node, context) {
  return "children" in node
    ? node.children.map((child) => inlineText(child, context)).join("")
    : "";
}

/**
 * @param {MdastNode} node
 * @param {WalkContext} context
 * @returns {void}
 */
function collectBlocks(node, context) {
  if (SKIPPED_TYPES.has(node.type)) {
    return;
  }

  if (node.type === "heading" || node.type === "paragraph") {
    const text = inlineText(node, context);

    if (text) {
      context.blocks.push(text);
    }

    return;
  }

  if ("children" in node) {
    for (const child of node.children) {
      collectBlocks(child, context);
    }
  }
}

/**
 * @param {MdastNode} node
 * @param {WalkContext} context
 * @returns {string}
 */
function inlineText(node, context) {
  switch (node.type) {
    case "break": {
      return "\n";
    }
    case "emphasis": {
      const text = childrenText(node, context);

      return isUnderscoreDelimited(node, context.characters)
        ? `${LEFT_QUOTE}${text}${RIGHT_QUOTE}`
        : text;
    }
    case "image": {
      return node.alt ?? "";
    }
    case "inlineCode": {
      // Deliberately not dash-substituted — code is verbatim.
      return node.value;
    }
    case "text": {
      return applySmartDashes(node.value);
    }
    default: {
      // Wrappers (link, strong, …) contribute their children; leaf nodes with no
      // children (raw html, footnote references) contribute nothing.
      return childrenText(node, context);
    }
  }
}

/**
 * @param {MdastNode} node
 * @param {string[] | undefined} characters
 * @returns {boolean}
 */
function isUnderscoreDelimited(node, characters) {
  const offset = node.position?.start.offset;

  return (
    characters !== undefined &&
    offset !== undefined &&
    characters[offset] === "_"
  );
}

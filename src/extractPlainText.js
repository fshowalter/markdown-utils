import { markdownToMdast } from "satteri";

import { MARKDOWN_FEATURES } from "./features.js";
import { applySmartDashes } from "./plugins/smartDashes.js";

/** @import { MdastNode } from "satteri" */

/**
 * Flattens markdown to plain text, replacing `strip-markdown`.
 *
 * AIDEV-NOTE: The output shape is load-bearing — buildDescription slices it to
 * 160 characters for the meta description. It reproduces strip-markdown: every
 * paragraph and heading becomes a block (including ones nested in lists and
 * blockquotes), blocks are joined with a blank line, and a trailing newline is
 * appended when there is any content at all.
 *
 * Plugins do not run under `markdownToMdast`, so the dash substitution is applied
 * here directly rather than via the smartDashes plugin. Smart quotes and ellipses
 * are parser features and so are already present in the tree.
 */

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
 * @param {string} source
 * @returns {string}
 */
export function extractPlainText(source) {
  /** @type {string[]} */
  const blocks = [];

  collectBlocks(
    markdownToMdast(source, { features: MARKDOWN_FEATURES }),
    blocks,
  );

  return blocks.length > 0 ? `${blocks.join("\n\n")}\n` : "";
}

/**
 * @param {MdastNode} node
 * @param {string[]} blocks
 * @returns {void}
 */
function collectBlocks(node, blocks) {
  if (SKIPPED_TYPES.has(node.type)) {
    return;
  }

  if (node.type === "heading" || node.type === "paragraph") {
    const text = inlineText(node);

    if (text) {
      blocks.push(text);
    }

    return;
  }

  if ("children" in node) {
    for (const child of node.children) {
      collectBlocks(child, blocks);
    }
  }
}

/**
 * @param {MdastNode} node
 * @returns {string}
 */
function inlineText(node) {
  switch (node.type) {
    case "break": {
      return "\n";
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
      // Wrappers (emphasis, link, …) contribute their children; leaf nodes with
      // no children (raw html, footnote references) contribute nothing.
      return "children" in node
        ? node.children.map((child) => inlineText(child)).join("")
        : "";
    }
  }
}

import { defineMdastPlugin } from "satteri";

/** @import { MdastNode, MdastVisitorContext } from "satteri" */

/**
 * Drops every root-level block that follows the first paragraph, leaving an
 * excerpt. Blocks *before* the first paragraph survive — the trim is positional,
 * which is the behaviour the remark implementation had.
 *
 * AIDEV-NOTE: Sätteri has no `root` visitor key, and replacing the root with a
 * new root node throws ("cannot encode replacement content of type root into the
 * structural op-stream"). So one visitor is registered per root-content type and
 * removes nodes individually. `yaml`/`toml` are deliberately absent: frontmatter
 * never renders, so there is nothing to trim.
 *
 * This is a factory rather than a plain definition so the "seen" flag resets
 * between documents — Sätteri calls factories once per compile.
 *
 * AIDEV-NOTE: The return type is deliberately left to inference rather than
 * annotated as `MdastPluginDefinition`. Since 0.10, Sätteri infers whether
 * `markdownToHtml` returns a result or a promise from the visitors' return
 * types, and the wide definition type resolves to "maybe async", which would
 * make renderExcerpt's call return `Result | Promise<Result>`.
 */
export function trimToExcerpt() {
  let seenFirstParagraph = false;

  /**
   * @param {Readonly<MdastNode>} node
   * @param {MdastVisitorContext} ctx
   * @returns {void}
   */
  const trimAfterFirstParagraph = (node, ctx) => {
    if (ctx.parent(node)?.type !== "root") {
      return;
    }

    if (seenFirstParagraph) {
      ctx.removeNode(node);
      return;
    }

    if (node.type === "paragraph") {
      seenFirstParagraph = true;
    }
  };

  return defineMdastPlugin({
    blockquote: trimAfterFirstParagraph,
    code: trimAfterFirstParagraph,
    definition: trimAfterFirstParagraph,
    footnoteDefinition: trimAfterFirstParagraph,
    heading: trimAfterFirstParagraph,
    html: trimAfterFirstParagraph,
    list: trimAfterFirstParagraph,
    name: "trim-to-excerpt",
    paragraph: trimAfterFirstParagraph,
    table: trimAfterFirstParagraph,
    thematicBreak: trimAfterFirstParagraph,
  });
}

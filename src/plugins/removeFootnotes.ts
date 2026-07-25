import { defineMdastPlugin } from "satteri";

/**
 * Strips footnotes for contexts that can't show them — excerpts and plain text.
 *
 * Removes definitions as well as references, so nothing is left to render even
 * if a reference survives elsewhere. Note this also removes a reference at index
 * 0 of its parent, which the old `unist-util-visit` implementation skipped
 * because its guard tested `index &&` rather than `index !== undefined`.
 */
export const removeFootnotes = defineMdastPlugin({
  footnoteDefinition(node, ctx) {
    ctx.removeNode(node);
  },
  footnoteReference(node, ctx) {
    ctx.removeNode(node);
  },
  name: "remove-footnotes",
});

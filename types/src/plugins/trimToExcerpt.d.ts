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
export function trimToExcerpt(): {
    blockquote: (node: Readonly<MdastNode>, ctx: MdastVisitorContext) => void;
    code: (node: Readonly<MdastNode>, ctx: MdastVisitorContext) => void;
    definition: (node: Readonly<MdastNode>, ctx: MdastVisitorContext) => void;
    footnoteDefinition: (node: Readonly<MdastNode>, ctx: MdastVisitorContext) => void;
    heading: (node: Readonly<MdastNode>, ctx: MdastVisitorContext) => void;
    html: (node: Readonly<MdastNode>, ctx: MdastVisitorContext) => void;
    list: (node: Readonly<MdastNode>, ctx: MdastVisitorContext) => void;
    name: string;
    paragraph: (node: Readonly<MdastNode>, ctx: MdastVisitorContext) => void;
    table: (node: Readonly<MdastNode>, ctx: MdastVisitorContext) => void;
    thematicBreak: (node: Readonly<MdastNode>, ctx: MdastVisitorContext) => void;
};
import type { MdastNode } from "satteri";
import type { MdastVisitorContext } from "satteri";
//# sourceMappingURL=trimToExcerpt.d.ts.map
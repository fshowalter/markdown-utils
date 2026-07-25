/** @import { MdastNode, MdastPluginDefinition, MdastVisitorContext } from "satteri" */
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
 * @returns {MdastPluginDefinition}
 */
export function trimToExcerpt(): MdastPluginDefinition;
import type { MdastPluginDefinition } from "satteri";
//# sourceMappingURL=trimToExcerpt.d.ts.map
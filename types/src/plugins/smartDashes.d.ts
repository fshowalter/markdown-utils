/**
 * Exported separately from the plugin because extractPlainText walks
 * `markdownToMdast` output, which never runs plugins, and so has to apply the
 * substitution itself.
 *
 * @param {string} value
 * @returns {string}
 */
export function applySmartDashes(value: string): string;
export namespace smartDashes {
    let name: string;
    function text(node: Readonly<import("mdast").Text>, ctx: import("satteri").MdastVisitorContext): undefined;
}
//# sourceMappingURL=smartDashes.d.ts.map
/**
 * Renders a single line of markdown as inline HTML, with no block wrapper.
 *
 * Used for readings' edition notes — short strings like
 * `_In a Lonely Place_, Valancourt Books, 2023` that get dropped into an inline
 * context. ReadingHistory.astro already supplies the element
 * (`<span class="rendered-markdown">`), so this returns just the contents.
 *
 * AIDEV-NOTE: This replaces a `rootAsSpan` hast plugin that retagged the leading
 * `<p>` as a `<span>`. That only ever existed because the block pipeline wraps
 * everything in a paragraph, and it produced a redundant span nested inside the
 * consumer's own. Unwrapping is the same fix without the plugin.
 *
 * Input that isn't a single paragraph is returned untouched rather than
 * mangled — every edition note in content is one line, so nothing hits that path.
 *
 * @param {string} source
 * @returns {string}
 */
export function renderInlineHtml(source: string): string;
//# sourceMappingURL=renderInlineHtml.d.ts.map
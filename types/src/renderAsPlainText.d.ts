/**
 * @typedef {object} RenderAsPlainTextOptions
 * @property {number} [maxLength] Character ceiling, 160 by default. Longer text
 *   is cut on a word boundary, so the result is usually shorter than the cap.
 * @property {boolean} [quoteUnderscoreEmphasis] Wrap `_underscore emphasis_` in
 *   smart double quotes rather than dropping the markers, for sources that use
 *   it to mark titles. Off by default. Asterisk emphasis is never quoted.
 */
/**
 * Renders markdown as single-spaced plain text, capped and never cut mid-word —
 * shaped for attributes that carry no markup, such as `<meta name="description">`
 * and its OpenGraph twin.
 *
 * @param {string} source
 * @param {RenderAsPlainTextOptions} [options]
 * @returns {string}
 */
export function renderAsPlainText(source: string, options?: RenderAsPlainTextOptions): string;
export type RenderAsPlainTextOptions = {
    /**
     * Character ceiling, 160 by default. Longer text
     * is cut on a word boundary, so the result is usually shorter than the cap.
     */
    maxLength?: number | undefined;
    /**
     * Wrap `_underscore emphasis_` in
     * smart double quotes rather than dropping the markers, for sources that use
     * it to mark titles. Off by default. Asterisk emphasis is never quoted.
     */
    quoteUnderscoreEmphasis?: boolean | undefined;
};
//# sourceMappingURL=renderAsPlainText.d.ts.map
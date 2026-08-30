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
export function extractPlainText(source: string, options?: ExtractPlainTextOptions): string;
export type ExtractPlainTextOptions = {
    /**
     * Wrap `_underscore emphasis_` in
     * smart double quotes instead of dropping the markers. Asterisk emphasis is
     * left alone, so `_The Shining_` reads as a title while `*very*` does not.
     */
    quoteUnderscoreEmphasis?: boolean | undefined;
};
export type WalkContext = {
    /**
     * Blocks collected so far.
     */
    blocks: string[];
    /**
     * The markdown source, present only when
     * underscore emphasis is being quoted.
     */
    source: string | undefined;
};
//# sourceMappingURL=extractPlainText.d.ts.map
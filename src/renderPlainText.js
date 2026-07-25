import { extractPlainText } from "./extractPlainText.js";

/** Fits the `<meta name="description">` ceiling, the original caller's need. */
const DEFAULT_MAX_LENGTH = 160;

/** Must match the quotes `extractPlainText` wraps underscore emphasis in. */
const LEFT_QUOTE = "\u{201C}";
const RIGHT_QUOTE = "\u{201D}";

/**
 * @typedef {object} RenderPlainTextOptions
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
 * @param {RenderPlainTextOptions} [options]
 * @returns {string}
 */
export function renderPlainText(source, options = {}) {
  const { maxLength = DEFAULT_MAX_LENGTH, quoteUnderscoreEmphasis = false } =
    options;

  const text = extractPlainText(source, { quoteUnderscoreEmphasis }).replaceAll(
    /\r?\n|\r/g,
    " ",
  );

  if (text.length <= maxLength) {
    return text.trimEnd();
  }

  const truncated = text.slice(0, Math.max(0, maxLength));

  //re-trim if we are in the middle of a word
  return dropUnclosedQuote(
    truncated.slice(0, Math.max(0, truncated.lastIndexOf(" "))),
  );
}

/**
 * Truncation can land inside a quoted title, leaving an opening quote with no
 * partner. Drop the orphan and the words it opened. Only truncated text is
 * checked — an unmatched quote the author wrote is theirs to keep.
 *
 * @param {string} text
 * @returns {string}
 */
function dropUnclosedQuote(text) {
  const opened = text.lastIndexOf(LEFT_QUOTE);

  return opened !== -1 && !text.includes(RIGHT_QUOTE, opened)
    ? text.slice(0, opened).trimEnd()
    : text;
}

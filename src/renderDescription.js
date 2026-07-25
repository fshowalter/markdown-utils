import { extractPlainText } from "./extractPlainText.js";

const MAX_LENGTH = 160;

/**
 * Builds the `<meta name="description">` text: plain text, single-spaced, capped
 * at 160 characters and never cut mid-word.
 *
 * @param {string} source
 * @returns {string}
 */
export function renderDescription(source) {
  const description = extractPlainText(source)
    .replaceAll(/\r?\n|\r/g, " ")
    .slice(0, Math.max(0, MAX_LENGTH));

  //re-trim if we are in the middle of a word
  return description.slice(
    0,
    Math.max(0, Math.min(description.length, description.lastIndexOf(" "))),
  );
}

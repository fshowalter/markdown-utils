import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { renderInlineHtml } from "./renderInlineHtml.js";

// Feeds readings.editionNotesHtml, which ReadingHistory.astro drops into an
// existing <span class="rendered-markdown leading-none"> — so this must emit no
// block wrapper of its own.

describe("renderInlineHtml", () => {
  it("renders a single line with no wrapping element", () => {
    assert.strictEqual(
      renderInlineHtml("New American Library, 1986"),
      "New American Library, 1986",
    );
  });

  it("keeps inline markup", () => {
    assert.strictEqual(
      renderInlineHtml("_In a Lonely Place_, Valancourt Books, 2023"),
      "<em>In a Lonely Place</em>, Valancourt Books, 2023",
    );
  });

  it("keeps a raw span", () => {
    assert.strictEqual(
      renderInlineHtml('Notes <span data-title-id="t">"T"</span> end'),
      'Notes <span data-title-id="t">“T”</span> end',
    );
  });

  it("applies smart punctuation", () => {
    assert.strictEqual(
      renderInlineHtml("Gollancz, 1975--reissued"),
      "Gollancz, 1975—reissued",
    );
  });

  it("encodes an ampersand", () => {
    assert.strictEqual(
      renderInlineHtml("Thomas & Mercer, 2012"),
      "Thomas &amp; Mercer, 2012",
    );
  });

  it("returns an empty string for empty input", () => {
    assert.strictEqual(renderInlineHtml(""), "");
  });

  it("returns an empty string for whitespace-only input", () => {
    assert.strictEqual(renderInlineHtml(" ".repeat(3)), "");
  });

  // Guard rather than a feature: edition notes are always one line, but silently
  // stripping the first <p> of a multi-block string would corrupt it.
  it("leaves multi-paragraph input wrapped", () => {
    assert.strictEqual(
      renderInlineHtml("first\n\nsecond"),
      "<p>first</p>\n<p>second</p>",
    );
  });

  it("leaves a non-paragraph block alone", () => {
    assert.strictEqual(renderInlineHtml("## Head"), "<h2>Head</h2>");
  });
});

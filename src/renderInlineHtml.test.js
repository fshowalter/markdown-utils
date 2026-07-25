import { describe, it } from "vitest";

import { renderInlineHtml } from "./renderInlineHtml.js";

// Feeds readings.editionNotesHtml, which ReadingHistory.astro drops into an
// existing <span class="rendered-markdown leading-none"> — so this must emit no
// block wrapper of its own.

describe("renderInlineHtml", () => {
  it("renders a single line with no wrapping element", ({ expect }) => {
    expect(renderInlineHtml("New American Library, 1986")).toBe(
      "New American Library, 1986",
    );
  });

  it("keeps inline markup", ({ expect }) => {
    expect(
      renderInlineHtml("_In a Lonely Place_, Valancourt Books, 2023"),
    ).toBe("<em>In a Lonely Place</em>, Valancourt Books, 2023");
  });

  it("keeps a raw span", ({ expect }) => {
    expect(
      renderInlineHtml('Notes <span data-title-id="t">"T"</span> end'),
    ).toBe('Notes <span data-title-id="t">“T”</span> end');
  });

  it("applies smart punctuation", ({ expect }) => {
    expect(renderInlineHtml("Gollancz, 1975--reissued")).toBe(
      "Gollancz, 1975—reissued",
    );
  });

  it("encodes an ampersand", ({ expect }) => {
    expect(renderInlineHtml("Thomas & Mercer, 2012")).toBe(
      "Thomas &amp; Mercer, 2012",
    );
  });

  it("returns an empty string for empty input", ({ expect }) => {
    expect(renderInlineHtml("")).toBe("");
  });

  it("returns an empty string for whitespace-only input", ({ expect }) => {
    expect(renderInlineHtml(" ".repeat(3))).toBe("");
  });

  // Guard rather than a feature: edition notes are always one line, but silently
  // stripping the first <p> of a multi-block string would corrupt it.
  it("leaves multi-paragraph input wrapped", ({ expect }) => {
    expect(renderInlineHtml("first\n\nsecond")).toBe(
      "<p>first</p>\n<p>second</p>",
    );
  });

  it("leaves a non-paragraph block alone", ({ expect }) => {
    expect(renderInlineHtml("## Head")).toBe("<h2>Head</h2>");
  });
});

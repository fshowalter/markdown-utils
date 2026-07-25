import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { extractPlainText } from "./extractPlainText.js";

// AIDEV-NOTE: Every expectation here was measured from the strip-markdown
// pipeline this replaces, including the block-joining and trailing-newline shape,
// because buildDescription slices the result to 160 characters.

describe("extractPlainText", () => {
  it("strips inline markup and reduces links to their text", () => {
    assert.strictEqual(
      extractPlainText("Hello *world* and [link](/x)."),
      "Hello world and link.\n",
    );
  });

  it("reduces an image to its alt text", () => {
    assert.strictEqual(extractPlainText("![alt text](/img.png)"), "alt text\n");
  });

  it("keeps image alt text inline within a paragraph", () => {
    assert.strictEqual(
      extractPlainText("Text ![alt](/i.png) more."),
      "Text alt more.\n",
    );
  });

  it("separates paragraphs with a blank line", () => {
    assert.strictEqual(extractPlainText("One.\n\nTwo."), "One.\n\nTwo.\n");
  });

  it("treats a heading as its own block", () => {
    assert.strictEqual(
      extractPlainText("## A heading\n\nBody text."),
      "A heading\n\nBody text.\n",
    );
  });

  it("treats each list item as its own block", () => {
    assert.strictEqual(
      extractPlainText("- one\n- two\n- three"),
      "one\n\ntwo\n\nthree\n",
    );
  });

  it("flattens nested list items", () => {
    assert.strictEqual(
      extractPlainText("- one\n  - inner\n- two"),
      "one\n\ninner\n\ntwo\n",
    );
  });

  it("unwraps blockquotes", () => {
    assert.strictEqual(
      extractPlainText("> quoted text\n\nAfter."),
      "quoted text\n\nAfter.\n",
    );
  });

  it("drops fenced code blocks entirely", () => {
    assert.strictEqual(extractPlainText("```js\nconst a = 1;\n```"), "");
  });

  it("keeps inline code verbatim", () => {
    assert.strictEqual(
      extractPlainText("Use `const` here."),
      "Use const here.\n",
    );
  });

  it("drops thematic breaks", () => {
    assert.strictEqual(
      extractPlainText("One.\n\n---\n\nTwo."),
      "One.\n\nTwo.\n",
    );
  });

  it("drops frontmatter", () => {
    assert.strictEqual(
      extractPlainText("---\nslug: x\n---\n\nBody."),
      "Body.\n",
    );
  });

  it("removes footnote references and definitions", () => {
    assert.strictEqual(
      extractPlainText("Text[^1] here.\n\n[^1]: The note."),
      "Text here.\n",
    );
  });

  it("drops raw HTML tags but keeps their text content", () => {
    assert.strictEqual(
      extractPlainText('A <span data-title-id="x">"T"</span> ref.'),
      "A “T” ref.\n",
    );
  });

  it("returns an empty string for empty input", () => {
    assert.strictEqual(extractPlainText(""), "");
  });

  it("returns an empty string for whitespace-only input", () => {
    assert.strictEqual(extractPlainText(" ".repeat(3)), "");
  });

  it("still applies smart punctuation", () => {
    assert.strictEqual(extractPlainText(`a--b ... "q"`), "a—b … “q”\n");
  });

  it("does not dash-substitute inside inline code", () => {
    assert.strictEqual(
      extractPlainText("Use `a--b` here."),
      "Use a--b here.\n",
    );
  });
});

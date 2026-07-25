import { describe, it } from "vitest";

import { extractPlainText } from "./extractPlainText.js";

// AIDEV-NOTE: Every expectation here was measured from the strip-markdown
// pipeline this replaces, including the block-joining and trailing-newline shape,
// because buildDescription slices the result to 160 characters.

describe("extractPlainText", () => {
  it("strips inline markup and reduces links to their text", ({ expect }) => {
    expect(extractPlainText("Hello *world* and [link](/x).")).toBe(
      "Hello world and link.\n",
    );
  });

  it("reduces an image to its alt text", ({ expect }) => {
    expect(extractPlainText("![alt text](/img.png)")).toBe("alt text\n");
  });

  it("keeps image alt text inline within a paragraph", ({ expect }) => {
    expect(extractPlainText("Text ![alt](/i.png) more.")).toBe(
      "Text alt more.\n",
    );
  });

  it("separates paragraphs with a blank line", ({ expect }) => {
    expect(extractPlainText("One.\n\nTwo.")).toBe("One.\n\nTwo.\n");
  });

  it("treats a heading as its own block", ({ expect }) => {
    expect(extractPlainText("## A heading\n\nBody text.")).toBe(
      "A heading\n\nBody text.\n",
    );
  });

  it("treats each list item as its own block", ({ expect }) => {
    expect(extractPlainText("- one\n- two\n- three")).toBe(
      "one\n\ntwo\n\nthree\n",
    );
  });

  it("flattens nested list items", ({ expect }) => {
    expect(extractPlainText("- one\n  - inner\n- two")).toBe(
      "one\n\ninner\n\ntwo\n",
    );
  });

  it("unwraps blockquotes", ({ expect }) => {
    expect(extractPlainText("> quoted text\n\nAfter.")).toBe(
      "quoted text\n\nAfter.\n",
    );
  });

  it("drops fenced code blocks entirely", ({ expect }) => {
    expect(extractPlainText("```js\nconst a = 1;\n```")).toBe("");
  });

  it("keeps inline code verbatim", ({ expect }) => {
    expect(extractPlainText("Use `const` here.")).toBe("Use const here.\n");
  });

  it("drops thematic breaks", ({ expect }) => {
    expect(extractPlainText("One.\n\n---\n\nTwo.")).toBe("One.\n\nTwo.\n");
  });

  it("drops frontmatter", ({ expect }) => {
    expect(extractPlainText("---\nslug: x\n---\n\nBody.")).toBe("Body.\n");
  });

  it("removes footnote references and definitions", ({ expect }) => {
    expect(extractPlainText("Text[^1] here.\n\n[^1]: The note.")).toBe(
      "Text here.\n",
    );
  });

  it("drops raw HTML tags but keeps their text content", ({ expect }) => {
    expect(extractPlainText('A <span data-title-id="x">"T"</span> ref.')).toBe(
      "A “T” ref.\n",
    );
  });

  it("returns an empty string for empty input", ({ expect }) => {
    expect(extractPlainText("")).toBe("");
  });

  it("returns an empty string for whitespace-only input", ({ expect }) => {
    expect(extractPlainText(" ".repeat(3))).toBe("");
  });

  it("still applies smart punctuation", ({ expect }) => {
    expect(extractPlainText(`a--b ... "q"`)).toBe("a—b … “q”\n");
  });

  it("does not dash-substitute inside inline code", ({ expect }) => {
    expect(extractPlainText("Use `a--b` here.")).toBe("Use a--b here.\n");
  });
});

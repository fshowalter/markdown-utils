import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { renderExcerpt } from "./renderExcerpt.js";

describe("renderExcerpt", () => {
  describe("source selection", () => {
    it("uses the body when there is no synopsis", () => {
      assert.strictEqual(
        renderExcerpt({}, "Body para.\n\nMore."),
        "<p>Body para.</p>",
      );
    });

    it("prefers a non-blank synopsis over the body", () => {
      assert.strictEqual(
        renderExcerpt({ synopsis: "A synopsis." }, "Body para."),
        "<p>A synopsis.</p>",
      );
    });

    it("falls back to the body when the synopsis is whitespace only", () => {
      assert.strictEqual(
        renderExcerpt({ synopsis: " ".repeat(3) }, "Body para."),
        "<p>Body para.</p>",
      );
    });

    it("applies smart punctuation to synopsis text", () => {
      assert.strictEqual(
        renderExcerpt({ synopsis: "cabin--and more." }, "body"),
        "<p>cabin—and more.</p>",
      );
    });
  });

  describe("trimming", () => {
    it("keeps only the first paragraph", () => {
      assert.strictEqual(
        renderExcerpt({}, "First para.\n\nSecond para.\n\nThird."),
        "<p>First para.</p>",
      );
    });

    // AIDEV-NOTE: the trim is "everything after the first paragraph", so blocks
    // that appear BEFORE the first paragraph survive. 54 content files carry an
    // inert `<!-- end -->` marker that no code reads — the trim is positional.
    it("keeps blocks that precede the first paragraph", () => {
      assert.strictEqual(
        renderExcerpt({}, "## Head\n\nFirst para.\n\nSecond."),
        "<h2>Head</h2>\n<p>First para.</p>",
      );
    });

    it("drops an end marker that follows the first paragraph", () => {
      assert.strictEqual(
        renderExcerpt({}, "First para.\n\n<!-- end -->\n\nSecond."),
        "<p>First para.</p>",
      );
    });

    it("drops a thematic break that follows the first paragraph", () => {
      assert.strictEqual(
        renderExcerpt({}, "First.\n\n---\n\nSecond."),
        "<p>First.</p>",
      );
    });

    it("drops a list that follows the first paragraph", () => {
      assert.strictEqual(
        renderExcerpt({}, "First.\n\n- a\n- b"),
        "<p>First.</p>",
      );
    });

    it("skips frontmatter when handed a whole file", () => {
      assert.strictEqual(
        renderExcerpt({}, "---\nslug: x\n---\n\nFirst.\n\nSecond."),
        "<p>First.</p>",
      );
    });

    // The plugin is a factory so its "seen first paragraph" flag resets per call.
    it("does not leak trim state between documents", () => {
      renderExcerpt({}, "One A.\n\nOne B.");

      assert.strictEqual(
        renderExcerpt({}, "Two A.\n\nTwo B."),
        "<p>Two A.</p>",
      );
    });
  });

  describe("footnotes", () => {
    it("removes a footnote reference and emits no footnote section", () => {
      assert.strictEqual(
        renderExcerpt({}, "First[^1] para.\n\nSecond.\n\n[^1]: note."),
        "<p>First para.</p>",
      );
    });
  });

  describe("raw HTML", () => {
    it("preserves a data-title-id span", () => {
      assert.strictEqual(
        renderExcerpt(
          {},
          'A <span data-title-id="x">"T"</span> ref.\n\nSecond.',
        ),
        '<p>A <span data-title-id="x">“T”</span> ref.</p>',
      );
    });
  });
});

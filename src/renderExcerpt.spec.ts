import { describe, it } from "vitest";

import { renderExcerpt } from "./renderExcerpt.js";

describe("renderExcerpt", () => {
  describe("source selection", () => {
    it("uses the body when there is no synopsis", ({ expect }) => {
      expect(renderExcerpt({}, "Body para.\n\nMore.")).toBe(
        "<p>Body para.</p>",
      );
    });

    it("prefers a non-blank synopsis over the body", ({ expect }) => {
      expect(renderExcerpt({ synopsis: "A synopsis." }, "Body para.")).toBe(
        "<p>A synopsis.</p>",
      );
    });

    it("falls back to the body when the synopsis is whitespace only", ({
      expect,
    }) => {
      expect(renderExcerpt({ synopsis: " ".repeat(3) }, "Body para.")).toBe(
        "<p>Body para.</p>",
      );
    });

    it("applies smart punctuation to synopsis text", ({ expect }) => {
      expect(renderExcerpt({ synopsis: "cabin--and more." }, "body")).toBe(
        "<p>cabin—and more.</p>",
      );
    });
  });

  describe("trimming", () => {
    it("keeps only the first paragraph", ({ expect }) => {
      expect(renderExcerpt({}, "First para.\n\nSecond para.\n\nThird.")).toBe(
        "<p>First para.</p>",
      );
    });

    // AIDEV-NOTE: the trim is "everything after the first paragraph", so blocks
    // that appear BEFORE the first paragraph survive. 54 content files carry an
    // inert `<!-- end -->` marker that no code reads — the trim is positional.
    it("keeps blocks that precede the first paragraph", ({ expect }) => {
      expect(renderExcerpt({}, "## Head\n\nFirst para.\n\nSecond.")).toBe(
        "<h2>Head</h2>\n<p>First para.</p>",
      );
    });

    it("drops an end marker that follows the first paragraph", ({ expect }) => {
      expect(renderExcerpt({}, "First para.\n\n<!-- end -->\n\nSecond.")).toBe(
        "<p>First para.</p>",
      );
    });

    it("drops a thematic break that follows the first paragraph", ({
      expect,
    }) => {
      expect(renderExcerpt({}, "First.\n\n---\n\nSecond.")).toBe(
        "<p>First.</p>",
      );
    });

    it("drops a list that follows the first paragraph", ({ expect }) => {
      expect(renderExcerpt({}, "First.\n\n- a\n- b")).toBe("<p>First.</p>");
    });

    it("skips frontmatter when handed a whole file", ({ expect }) => {
      expect(renderExcerpt({}, "---\nslug: x\n---\n\nFirst.\n\nSecond.")).toBe(
        "<p>First.</p>",
      );
    });

    // The plugin is a factory so its "seen first paragraph" flag resets per call.
    it("does not leak trim state between documents", ({ expect }) => {
      renderExcerpt({}, "One A.\n\nOne B.");

      expect(renderExcerpt({}, "Two A.\n\nTwo B.")).toBe("<p>Two A.</p>");
    });
  });

  describe("footnotes", () => {
    it("removes a footnote reference and emits no footnote section", ({
      expect,
    }) => {
      expect(
        renderExcerpt({}, "First[^1] para.\n\nSecond.\n\n[^1]: note."),
      ).toBe("<p>First para.</p>");
    });
  });

  describe("raw HTML", () => {
    it("preserves a data-title-id span", ({ expect }) => {
      expect(
        renderExcerpt(
          {},
          'A <span data-title-id="x">"T"</span> ref.\n\nSecond.',
        ),
      ).toBe('<p>A <span data-title-id="x">“T”</span> ref.</p>');
    });
  });
});

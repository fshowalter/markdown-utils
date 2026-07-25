import { describe, it } from "vitest";

import { parseFrontmatter } from "./parseFrontmatter.js";

describe("parseFrontmatter", () => {
  it("parses the YAML block into an object", ({ expect }) => {
    expect(
      parseFrontmatter("---\nslug: a-slug\ngrade: B+\n---\n\nBody.", "a.md"),
    ).toStrictEqual({ grade: "B+", slug: "a-slug" });
  });

  it("parses nested structures", ({ expect }) => {
    const frontmatter = parseFrontmatter(
      "---\ntimeline:\n  - date: 2011-11-04\n    progress: 37%\n---\n",
      "a.md",
    );

    expect(frontmatter.timeline).toStrictEqual([
      { date: "2011-11-04", progress: "37%" },
    ]);
  });

  // AIDEV-NOTE: js-yaml 5 leaves timestamps as strings rather than constructing
  // Date objects. The collection schemas depend on this — they coerce with
  // z.coerce.date().
  it("leaves dates as strings for the schemas to coerce", ({ expect }) => {
    expect(parseFrontmatter("---\ndate: 2022-10-29\n---\n", "a.md").date).toBe(
      "2022-10-29",
    );
  });

  it("throws with the file path when the fence is missing", ({ expect }) => {
    expect(() =>
      parseFrontmatter("Just a body.", "content/reviews/a.md"),
    ).toThrow("Frontmatter not found in content/reviews/a.md");
  });

  // AIDEV-NOTE: Deliberate narrowing from the regex this replaces, which tolerated
  // a leading BOM or blank lines. Sätteri requires the fence on line 1. All 286
  // content files already comply, and a file that stops complying now fails loudly
  // instead of silently losing its frontmatter.
  it("rejects frontmatter preceded by a blank line", ({ expect }) => {
    expect(() =>
      parseFrontmatter("\n\n---\nslug: a-slug\n---\n", "a.md"),
    ).toThrow("Frontmatter not found in a.md");
  });
});

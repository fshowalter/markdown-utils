import { describe, it } from "vitest";

import { renderDescription } from "./renderDescription";

// Feeds the <meta name="description"> tag, so the 160-character ceiling and the
// no-mid-word-truncation rule are both user visible.

const LONG_BODY =
  "Alcoholic writer Jack Torrance uproots his wife Wendy and five-year-old son Danny from New England to Colorado, where they'll serve as winter caretakers for the Overlook Hotel.";

describe("buildDescription", () => {
  it("returns a short body whole", ({ expect }) => {
    expect(renderDescription("Short body.")).toBe("Short body.");
  });

  it("collapses paragraph breaks to spaces", ({ expect }) => {
    expect(renderDescription("One.\n\nTwo.")).toBe("One.  Two.");
  });

  it("truncates a long body to at most 160 characters", ({ expect }) => {
    expect(renderDescription(LONG_BODY).length).toBeLessThanOrEqual(160);
  });

  it("truncates on a word boundary rather than mid-word", ({ expect }) => {
    expect(renderDescription(LONG_BODY)).toBe(
      "Alcoholic writer Jack Torrance uproots his wife Wendy and five-year-old son Danny from New England to Colorado, where they’ll serve as winter caretakers for",
    );
  });

  it("strips markdown syntax before measuring", ({ expect }) => {
    expect(renderDescription("A *very* [linked](/x) body.")).toBe(
      "A very linked body.",
    );
  });

  it("skips frontmatter when handed a whole file", ({ expect }) => {
    expect(renderDescription("---\nslug: x\n---\n\nBody text.")).toBe(
      "Body text.",
    );
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { renderDescription } from "./renderDescription.js";

// Feeds the <meta name="description"> tag, so the 160-character ceiling and the
// no-mid-word-truncation rule are both user visible.

const LONG_BODY =
  "Alcoholic writer Jack Torrance uproots his wife Wendy and five-year-old son Danny from New England to Colorado, where they'll serve as winter caretakers for the Overlook Hotel.";

describe("buildDescription", () => {
  it("returns a short body whole", () => {
    assert.strictEqual(renderDescription("Short body."), "Short body.");
  });

  it("collapses paragraph breaks to spaces", () => {
    assert.strictEqual(renderDescription("One.\n\nTwo."), "One.  Two.");
  });

  it("truncates a long body to at most 160 characters", () => {
    assert.ok(renderDescription(LONG_BODY).length <= 160);
  });

  it("truncates on a word boundary rather than mid-word", () => {
    assert.strictEqual(
      renderDescription(LONG_BODY),
      "Alcoholic writer Jack Torrance uproots his wife Wendy and five-year-old son Danny from New England to Colorado, where they’ll serve as winter caretakers for",
    );
  });

  it("strips markdown syntax before measuring", () => {
    assert.strictEqual(
      renderDescription("A *very* [linked](/x) body."),
      "A very linked body.",
    );
  });

  it("skips frontmatter when handed a whole file", () => {
    assert.strictEqual(
      renderDescription("---\nslug: x\n---\n\nBody text."),
      "Body text.",
    );
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { renderAsPlainText } from "./renderAsPlainText.js";

// Feeds markup-free attributes such as <meta name="description">, so the default
// 160-character ceiling and the no-mid-word-truncation rule are both user visible.

const LONG_BODY =
  "Alcoholic writer Jack Torrance uproots his wife Wendy and five-year-old son Danny from New England to Colorado, where they'll serve as winter caretakers for the Overlook Hotel.";

// The 160-character cut lands inside `_The Shining_`, leaving its opening quote
// without a partner.
const TITLE_AT_THE_CUT =
  "Alcoholic writer Jack Torrance uproots his wife Wendy and five-year-old son Danny from New England to Colorado to serve as winter caretakers, much as in _The Shining_ before them.";

describe("renderAsPlainText", () => {
  it("returns a short body whole", () => {
    assert.strictEqual(renderAsPlainText("Short body."), "Short body.");
  });

  it("collapses paragraph breaks to spaces", () => {
    assert.strictEqual(renderAsPlainText("One.\n\nTwo."), "One.  Two.");
  });

  it("truncates a long body to at most 160 characters", () => {
    assert.ok(renderAsPlainText(LONG_BODY).length <= 160);
  });

  it("truncates on a word boundary rather than mid-word", () => {
    assert.strictEqual(
      renderAsPlainText(LONG_BODY),
      "Alcoholic writer Jack Torrance uproots his wife Wendy and five-year-old son Danny from New England to Colorado, where they’ll serve as winter caretakers for",
    );
  });

  it("strips markdown syntax before measuring", () => {
    assert.strictEqual(
      renderAsPlainText("A *very* [linked](/x) body."),
      "A very linked body.",
    );
  });

  it("skips frontmatter when handed a whole file", () => {
    assert.strictEqual(
      renderAsPlainText("---\nslug: x\n---\n\nBody text."),
      "Body text.",
    );
  });

  describe("maxLength", () => {
    it("truncates to a shorter ceiling on a word boundary", () => {
      assert.strictEqual(
        renderAsPlainText(LONG_BODY, { maxLength: 40 }),
        "Alcoholic writer Jack Torrance uproots",
      );
    });

    it("returns a body that fits a larger ceiling whole", () => {
      assert.strictEqual(
        renderAsPlainText(LONG_BODY, { maxLength: 500 }),
        "Alcoholic writer Jack Torrance uproots his wife Wendy and five-year-old son Danny from New England to Colorado, where they’ll serve as winter caretakers for the Overlook Hotel.",
      );
    });

    it("returns an empty string for a ceiling of zero", () => {
      assert.strictEqual(renderAsPlainText(LONG_BODY, { maxLength: 0 }), "");
    });
  });

  describe("quoteUnderscoreEmphasis", () => {
    it("drops underscore emphasis markers by default", () => {
      assert.strictEqual(
        renderAsPlainText("I watched _The Shining_ again."),
        "I watched The Shining again.",
      );
    });

    it("quotes underscore emphasis when asked", () => {
      assert.strictEqual(
        renderAsPlainText("I watched _The Shining_ again.", {
          quoteUnderscoreEmphasis: true,
        }),
        "I watched “The Shining” again.",
      );
    });

    it("leaves asterisk emphasis unquoted", () => {
      assert.strictEqual(
        renderAsPlainText("A *very* good film.", {
          quoteUnderscoreEmphasis: true,
        }),
        "A very good film.",
      );
    });

    it("drops a title left unclosed by truncation", () => {
      assert.strictEqual(
        renderAsPlainText(TITLE_AT_THE_CUT, { quoteUnderscoreEmphasis: true }),
        "Alcoholic writer Jack Torrance uproots his wife Wendy and five-year-old son Danny from New England to Colorado to serve as winter caretakers, much as in",
      );
    });
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { renderHtml } from "./renderHtml.js";

// AIDEV-NOTE: Ported from the remark-era acceptance suite. Expectations are
// deliberately IDENTICAL to the pre-migration ones except where a comment says
// otherwise — that is what makes this a parity test rather than a fresh spec.

describe("renderHtml", () => {
  describe("block rendering", () => {
    it("renders emphasis and strong inside a paragraph", () => {
      assert.strictEqual(
        renderHtml("Hello *world* and **bold**."),
        "<p>Hello <em>world</em> and <strong>bold</strong>.</p>",
      );
    });

    it("renders separate paragraphs", () => {
      assert.strictEqual(
        renderHtml("One.\n\nTwo."),
        "<p>One.</p>\n<p>Two.</p>",
      );
    });

    it("renders a heading", () => {
      assert.strictEqual(renderHtml("## Head"), "<h2>Head</h2>");
    });

    it("renders a blockquote", () => {
      assert.strictEqual(
        renderHtml("> quoted"),
        "<blockquote>\n<p>quoted</p>\n</blockquote>",
      );
    });

    it("renders a thematic break between paragraphs", () => {
      assert.strictEqual(
        renderHtml("a\n\n---\n\nb"),
        "<p>a</p>\n<hr>\n<p>b</p>",
      );
    });

    it("renders a nested list", () => {
      assert.strictEqual(
        renderHtml("- one\n  - inner\n- two"),
        "<ul>\n<li>one\n<ul>\n<li>inner</li>\n</ul>\n</li>\n<li>two</li>\n</ul>",
      );
    });

    it("renders an image", () => {
      assert.strictEqual(
        renderHtml("![alt](/svg/5-stars.svg)"),
        '<p><img src="/svg/5-stars.svg" alt="alt"></p>',
      );
    });

    it("returns an empty string for empty input", () => {
      assert.strictEqual(renderHtml(""), "");
    });

    // Sätteri terminates output with a newline; the wrapper trims it so stored
    // HTML stays byte-comparable with the remark era.
    it("does not leave a trailing newline", () => {
      assert.strictEqual(renderHtml("A paragraph."), "<p>A paragraph.</p>");
    });
  });

  describe("frontmatter", () => {
    // The parser skips frontmatter, so every pipeline can take a whole file.
    it("skips a frontmatter block", () => {
      assert.strictEqual(
        renderHtml("---\nslug: a-slug\n---\n\nBody."),
        "<p>Body.</p>",
      );
    });
  });

  describe("raw HTML passthrough", () => {
    // linkReviewedTitles regexes these spans out of the stored HTML later, so the
    // attribute and inner text must survive byte-for-byte.
    it("preserves a data-title-id span", () => {
      assert.strictEqual(
        renderHtml(
          'An <span data-title-id="altar-by-philip-fracassi">"Altar"</span> ref.',
        ),
        '<p>An <span data-title-id="altar-by-philip-fracassi">“Altar”</span> ref.</p>',
      );
    });

    it("preserves a data-imdb-id span and renders markdown inside it", () => {
      assert.strictEqual(
        renderHtml(
          'See <span data-imdb-id="tt0105236">_Reservoir Dogs_</span>.',
        ),
        '<p>See <span data-imdb-id="tt0105236"><em>Reservoir Dogs</em></span>.</p>',
      );
    });

    it("preserves a br tag verbatim", () => {
      assert.strictEqual(
        renderHtml("line one<br>line two"),
        "<p>line one<br>line two</p>",
      );
    });

    // AIDEV-NOTE: Sätteri re-emits raw HTML verbatim rather than reparsing it the
    // way rehype-raw did, so a self-closing tag keeps the author's spelling.
    it("preserves a self-closing br as written", () => {
      assert.strictEqual(
        renderHtml("line one<br />line two"),
        "<p>line one<br />line two</p>",
      );
    });

    it("preserves an HTML comment", () => {
      assert.strictEqual(
        renderHtml("First.\n\n<!-- end -->\n\nSecond."),
        "<p>First.</p>\n<!-- end -->\n<p>Second.</p>",
      );
    });
  });

  describe("smart punctuation", () => {
    it("curls double quotes and apostrophes", () => {
      assert.strictEqual(
        renderHtml(`He said "hello" and it's fine.`),
        "<p>He said “hello” and it’s fine.</p>",
      );
    });

    it("pairs quotes across an inline element", () => {
      assert.strictEqual(
        renderHtml(`"*Emphasized* quote"`),
        "<p>“<em>Emphasized</em> quote”</p>",
      );
    });

    it("converts three dots to an ellipsis", () => {
      assert.strictEqual(renderHtml("Wait... really?"), "<p>Wait… really?</p>");
    });

    // AIDEV-NOTE: 66 content files use `--` as an em dash. Sätteri's native dash
    // handling would produce an EN dash, so it is disabled in MARKDOWN_FEATURES
    // and the smartDashes plugin supplies remark-smartypants' mapping. These four
    // cases are the contract.
    it("converts a double dash to an em dash", () => {
      assert.strictEqual(renderHtml("a--b"), "<p>a—b</p>");
    });

    it("leaves a triple dash alone", () => {
      assert.strictEqual(renderHtml("c---d"), "<p>c---d</p>");
    });

    it("leaves a quadruple dash alone", () => {
      assert.strictEqual(renderHtml("g----h"), "<p>g----h</p>");
    });

    it("leaves a spaced single dash alone", () => {
      assert.strictEqual(renderHtml("e - f"), "<p>e - f</p>");
    });

    it("does not touch punctuation inside inline code", () => {
      assert.strictEqual(
        renderHtml('use `a--b` and `"x"` here'),
        '<p>use <code>a--b</code> and <code>"x"</code> here</p>',
      );
    });

    it("applies dashes inside a raw span", () => {
      assert.strictEqual(
        renderHtml('x <span data-title-id="t">a--b</span> y'),
        '<p>x <span data-title-id="t">a—b</span> y</p>',
      );
    });
  });

  describe("footnotes", () => {
    // The classes and ids asserted here are styled by name in src/css/tailwind.css
    // (.footnotes, .footnotes h2, .data-footnote-backref, sup a).
    //
    // AIDEV-NOTE: The only difference from the remark output is that boolean
    // attributes serialize bare — `data-footnote-ref` rather than
    // `data-footnote-ref=""`. Nothing selects on them; the CSS uses the classes.
    it("renders a reference and the footnote section", () => {
      assert.strictEqual(
        renderHtml("Text[^1].\n\n[^1]: The note."),
        '<p>Text<sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref aria-describedby="footnote-label">1</a></sup>.</p>\n' +
          '<section data-footnotes class="footnotes"><h2 class="sr-only" id="footnote-label">Footnotes</h2>\n' +
          "<ol>\n" +
          '<li id="user-content-fn-1">\n' +
          '<p>The note. <a href="#user-content-fnref-1" data-footnote-backref="" aria-label="Back to reference 1" class="data-footnote-backref">↩︎</a></p>\n' +
          "</li>\n" +
          "</ol>\n" +
          "</section>",
      );
    });

    it("uses the configured backref content", () => {
      // U+FE0E forces the text presentation of the arrow rather than an emoji.
      assert.ok(
        renderHtml("Text[^1].\n\n[^1]: The note.").includes(">↩\u{FE0E}</a>"),
      );
    });

    it("hides the footnotes heading from sighted readers", () => {
      assert.ok(
        renderHtml("Text[^1].\n\n[^1]: The note.").includes(
          '<h2 class="sr-only" id="footnote-label">Footnotes</h2>',
        ),
      );
    });

    // content/reviews/live-and-let-die-by-ian-fleming.md relies on this.
    it("renders nothing for a footnote definition with no reference", () => {
      assert.strictEqual(
        renderHtml("No ref.\n\n[^1]: Orphan."),
        "<p>No ref.</p>",
      );
    });
  });
});

# markdown-utils

Utilities for markdown conversion, built on [Sätteri](https://www.npmjs.com/package/satteri).

Plain ESM JavaScript with no build step — Node imports the source directly. Types are
written as JSDoc annotations, checked with `tsc`, and shipped as generated `.d.ts`, so
TypeScript consumers get full type information without any opt-in.

## Install

```sh
npm install markdown-utils
```

Requires Node 24+.

## Usage

```js
import {
  renderDescription,
  renderExcerpt,
  renderInlineHtml,
  renderMarkdown,
} from "markdown-utils";
```

### `renderMarkdown(source)`

Full block HTML. Frontmatter is skipped by the parser, so a whole file can be passed.

```js
renderMarkdown("A *quiet* film -- and a fine one.");
// "<p>A <em>quiet</em> film — and a fine one.</p>"
```

Note that `--` becomes an em dash, matching remark-smartypants rather than Sätteri's
default en dash.

### `renderInlineHtml(source)`

A single line of markdown with no block wrapper, for dropping into an inline context.
Input that isn't a single paragraph is returned untouched.

```js
renderInlineHtml("_In a Lonely Place_, Valancourt Books, 2023");
// "<em>In a Lonely Place</em>, Valancourt Books, 2023"
```

### `renderExcerpt(frontmatter, source)`

Footnotes stripped and trimmed to the first paragraph. A non-blank `synopsis` frontmatter
entry wins over the body, and is rendered through the same pipeline so it gets the same
typography.

```js
renderExcerpt({}, "First paragraph.\n\nSecond paragraph.");
// "<p>First paragraph.</p>"

renderExcerpt({ synopsis: "A synopsis -- wins." }, "Body.");
// "<p>A synopsis — wins.</p>"
```

### `renderDescription(source)`

Plain text for `<meta name="description">`: single-spaced, capped at 160 characters and
never cut mid-word.

```js
renderDescription("# Heading\n\nSome *body* text here.");
// "Heading  Some body text here."
```

## Development

```sh
npm test              # node:test -- no test framework dependency
npm run test:coverage
npm run check         # tsc -- type-checks the JSDoc annotations
npm run lint
npm run format
npm run build:types   # regenerate types/; must be committed
```

`types/` is generated from the JSDoc annotations and committed. CI fails if it is stale,
so run `npm run build:types` after changing any exported signature.

# remark-figure-caption

[![npm](https://img.shields.io/npm/v/@microflash/remark-figure-caption)](https://www.npmjs.com/package/@microflash/remark-figure-caption)
[![regression](https://github.com/Microflash/remark-figure-caption/actions/workflows/regression.yml/badge.svg)](https://github.com/Microflash/remark-figure-caption/actions/workflows/regression.yml)
[![license](https://img.shields.io/npm/l/@microflash/remark-figure-caption)](./LICENSE.md)

[remark](https://github.com/remarkjs/remark) plugin to transform images with alt text, and markdown tables, into `<figure>` elements with captions. Includes support for auto-numbering and cross-references.

> **Note:** This is a fork maintained by Sebastian Romero, originally based on `@microflash/remark-figure-caption`. It adds support for Pandoc-style table captions, auto-numbering, cross-referencing, and is fully compatible with Astro 6 and Bun.

## Contents

- [What's this?](#whats-this)
- [Install](#install)
- [Use](#use)
- [API](#api)
	- [Options](#options)
- [Credits](#credits)
- [License](#license)

This package is a [unified](https://github.com/unifiedjs/unified) ([remark](https://github.com/remarkjs/remark)) plugin that takes image nodes with alt text (e.g., `![Alt text](path-to-image.jpg)`) and converts them to [figure](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure) elements with captions.

Additionally, it supports Pandoc-style **table captions**. If you place a paragraph starting with `Table:` before or after a markdown table, it will wrap the table in a `<figure>` and use the text as its `<figcaption>`.

You can also assign IDs to figures and tables `{#fig:my-id}`, and use cross-references `[](#fig:my-id)` which automatically inherit the figure numbers if `autoNumber` is enabled.

```html
<figure>
  <img src="path-to-image.jpg" />
  <figcaption>Alt Text</figcaption>
</figure>
```

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

In Node.js (16.0+), install with [npm](https://docs.npmjs.com/cli/install):

```sh
npm install @microflash/remark-figure-caption
```

> For Node.js versions below 16.0, stick to 1.x.x versions of this plugin.

In Deno, with [esm.sh](https://esm.sh/):

```js
import remarkFigureCaption from "https://esm.sh/@microflash/remark-figure-caption";
```

In browsers, with [esm.sh](https://esm.sh/):

```html
<script type="module">
  import remarkFigureCaption from "https://esm.sh/@microflash/remark-figure-caption?bundle";
</script>
```

## Use

Say we have the following module `example.js`:

```js
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkFigureCaption from "@microflash/remark-figure-caption";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

main()

async function main() {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkFigureCaption)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process("![Alt text](path-to-image.jpg)");

  console.log(String(file));
}
```

Running that with `node example.js` yields:

```html
<figure>
  <img src="path-to-image.jpg" />
  <figcaption>Alt Text</figcaption>
</figure>
```

## API

The default export is `remarkFigureCaption`.

### Options

The following options are available. All of them are optional.

- `figureClassName`: class for the wrapped `figure` element
- `imageClassName`: class for the wrapped `img` element
- `captionClassName`: class for the wrapped `figcaption` element
- `autoNumber`: boolean (default: `false`). Enables automatic numbering of figures and tables.
- `figurePrefix`: string (default: `"Figure "`). Prefix used for numbered images.
- `tablePrefix`: string (default: `"Table "`). Prefix used for numbered tables.

By default, no classes are added to the `figure`, `img` and `figcaption` elements.

### Examples

**Table Captions:**
```markdown
Table: My Caption

| a | b |
|---|---|
| 1 | 2 |
```

**Cross References with Auto-Numbering:**
```markdown
![My graph {#fig:graph1}](graph.png)

As seen in [](#fig:graph1)...
```
*Becomes: `As seen in <a href="#fig:graph1">Figure 1</a>...`*

## Credits

[Quang Trinh](https://github.com/tkhquang) who wrote the original [plugin](https://github.com/tkhquang/gridsome-remark-figure-caption). This is a direct ESM-only port.

## License

[MIT](./LICENSE.md)

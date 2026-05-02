# remark-figure-caption

[![npm](https://img.shields.io/npm/v/@sebastianromero/remark-figure-caption)](https://www.npmjs.com/package/@sebastianromero/remark-figure-caption)
[![license](https://img.shields.io/npm/l/@sebastianromero/remark-figure-caption)](./LICENSE.md)

[remark](https://github.com/remarkjs/remark) plugin to transform images with alt text, markdown tables, and fenced code blocks into `<figure>` elements with captions. Includes support for auto-numbering and cross-references.

> **Note:** This is a fork maintained by Sebastian Romero, originally based on `@microflash/remark-figure-caption`. It adds support for Pandoc-style table captions, code block captions, auto-numbering, cross-referencing, and is fully compatible with Astro 6 and Bun.

## Contents

- [What's this?](#whats-this)
- [Install](#install)
- [Use](#use)
- [API](#api)
	- [Options](#options)
- [Examples](#examples)
	- [Image Captions](#image-captions)
	- [Table Captions](#table-captions)
	- [Code Block Captions](#code-block-captions)
	- [Cross-References with Auto-Numbering](#cross-references-with-auto-numbering)
- [Credits](#credits)
- [License](#license)

## What's this?

This package is a [unified](https://github.com/unifiedjs/unified) ([remark](https://github.com/remarkjs/remark)) plugin that wraps the following elements in `<figure>` with a `<figcaption>`:

- **Images** with alt text: `![Alt text](path-to-image.jpg)`
- **Tables** with a `Table:` or `:` caption paragraph adjacent to them
- **Code blocks** with a `Code:` caption paragraph adjacent to them

You can also assign IDs to figures, tables, and code blocks with `{#my-id}`, and use cross-references `[](#my-id)` which automatically resolve to the element's number when `autoNumber` is enabled.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

In Node.js (16.0+), install with [npm](https://docs.npmjs.com/cli/install):

```sh
npm install @sebastianromero/remark-figure-caption
```

In Deno, with [esm.sh](https://esm.sh/):

```js
import remarkFigureCaption from "https://esm.sh/@sebastianromero/remark-figure-caption";
```

In browsers, with [esm.sh](https://esm.sh/):

```html
<script type="module">
  import remarkFigureCaption from "https://esm.sh/@sebastianromero/remark-figure-caption?bundle";
</script>
```

## Use

Say we have the following module `example.js`:

```js
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkFigureCaption from "@sebastianromero/remark-figure-caption";
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

| Option | Type | Default | Description |
|---|---|---|---|
| `figureClassName` | `string` | — | Class for the wrapped `<figure>` element |
| `imageClassName` | `string` | — | Class for the wrapped `<img>` element |
| `captionClassName` | `string` | — | Class for the wrapped `<figcaption>` element |
| `autoNumber` | `boolean` | `false` | Enables automatic numbering of figures, tables, and code blocks |
| `figurePrefix` | `string` | `"Figure "` | Prefix used for numbered images |
| `tablePrefix` | `string` | `"Table "` | Prefix used for numbered tables |
| `codePrefix` | `string` | `"Code "` | Prefix used for numbered code blocks |

By default, no classes are added to the `figure`, `img` and `figcaption` elements.

## Examples

### Image Captions

Any image with alt text is automatically wrapped in a `<figure>`:

```markdown
![A beautiful sunset](sunset.jpg)
```

Produces:

```html
<figure>
  <img src="sunset.jpg" alt="A beautiful sunset">
  <figcaption>A beautiful sunset</figcaption>
</figure>
```

### Table Captions

Place a paragraph starting with `Table:` (or just `:`) before or after a markdown table:

```markdown
Table: Population by country

| Country | Population |
|---------|------------|
| China   | 1.4B       |
| India   | 1.4B       |
```

Produces:

```html
<figure>
  <table>...</table>
  <figcaption>Population by country</figcaption>
</figure>
```

### Code Block Captions

Place a paragraph starting with `Code:` before or after a fenced code block:

````markdown
```css
.sidenote {
  float: right;
  clear: right;
  margin-right: -60%;
  width: 50%;
}
```

Code: Sidenote styling with CSS
````

Produces:

```html
<figure>
  <pre><code class="language-css">...</code></pre>
  <figcaption>Sidenote styling with CSS</figcaption>
</figure>
```

The caption can also be placed **before** the code block:

````markdown
Code: Example function

```js
function greet(name) {
  return `Hello, ${name}!`;
}
```
````

### Cross-References with Auto-Numbering

Assign IDs with `{#id}` and reference them with `[](#id)`:

```markdown
![My graph {#fig:graph1}](graph.png)

Table: Sales data {#tbl:sales}

| Q1 | Q2 |
|----|-----|
| 10 | 20 |
```

````markdown
```js
const x = 1;
```

Code: Example code {#lst:code1}
````

```markdown
As seen in [](#fig:graph1), [](#tbl:sales), and [](#lst:code1)...
```

With `autoNumber: true`, this becomes:

```
As seen in <a href="#fig:graph1">Figure 1</a>, <a href="#tbl:sales">Table 1</a>, and <a href="#lst:code1">Code 1</a>...
```

## Credits

[Quang Trinh](https://github.com/tkhquang) who wrote the original [plugin](https://github.com/tkhquang/gridsome-remark-figure-caption). This is a direct ESM-only port.

## License

[MIT](./LICENSE.md)

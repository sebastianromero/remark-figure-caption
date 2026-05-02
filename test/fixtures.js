export default [
	{
		title: "image with alt text as plaintext",
		input: `![Image](http://example.com/test.png)`,
		output: `<figure><img src="http://example.com/test.png" alt="Image"><figcaption>Image</figcaption></figure>`
	},
	{
		title: "image with alt text and custom classes",
		input: `![Image](http://example.com/test.png)`,
		output: `<figure class="figure"><img src="http://example.com/test.png" alt="Image" class="image"><figcaption class="figcaption">Image</figcaption></figure>`,
		options: {
			figureClassName: "figure",
			imageClassName: "image",
			captionClassName: "figcaption"
		}
	},
	{
		title: "image with alt text containing markdown",
		input: `![Image with **strong** _emphasis_](http://example.com/test.png)`,
		output: `<figure><img src="http://example.com/test.png" alt="Image with strong emphasis"><figcaption>Image with strong emphasis</figcaption></figure>`
	},
	{
		title: "raw image markup with caption",
		input: `<figure><img src="http://example.com/captioned.png" alt="Captioned image"><figcaption><em>Captioned image</em></figcaption></figure>`,
		output: `<figure><img src="http://example.com/captioned.png" alt="Captioned image"><figcaption><em>Captioned image</em></figcaption></figure>`
	},
	{
		title: "link with image",
		input: `[![Image](http://example.com/test.png)](http://example.com)`,
		output: `<p><a href="http://example.com"><img src="http://example.com/test.png" alt="Image"></a></p>`
	},
	{
		title: "image with no alt text",
		input: `![](http://example.com/test.png)`,
		output: `<img src="http://example.com/test.png" alt="">`
	},
	{
		title: "paragraph with no images",
		input: `A paragraph bereft of images`,
		output: `<p>A paragraph bereft of images</p>`
	},
	{
		title: "table with preceding caption",
		input: `Table: My table caption\n\n| a | b |\n|---|---|\n| 1 | 2 |`,
		output: `<figure><table>\n<thead>\n<tr>\n<th>a</th>\n<th>b</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>1</td>\n<td>2</td>\n</tr>\n</tbody>\n</table><figcaption>My table caption</figcaption></figure>`
	},
	{
		title: "table with succeeding caption",
		input: `| a | b |\n|---|---|\n| 1 | 2 |\n\nTable: My succeeding caption`,
		output: `<figure><table>\n<thead>\n<tr>\n<th>a</th>\n<th>b</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>1</td>\n<td>2</td>\n</tr>\n</tbody>\n</table><figcaption>My succeeding caption</figcaption></figure>`
	},
	{
		title: "table with : caption and markdown",
		input: `: My **strong** caption\n\n| a | b |\n|---|---|\n| 1 | 2 |`,
		output: `<figure><table>\n<thead>\n<tr>\n<th>a</th>\n<th>b</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>1</td>\n<td>2</td>\n</tr>\n</tbody>\n</table><figcaption>My <strong>strong</strong> caption</figcaption></figure>`
	},
	{
		title: "table with preceding empty caption",
		input: `Table:\n\n| a | b |\n|---|---|\n| 1 | 2 |`,
		output: `<figure><table>\n<thead>\n<tr>\n<th>a</th>\n<th>b</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>1</td>\n<td>2</td>\n</tr>\n</tbody>\n</table><figcaption></figcaption></figure>`
	},
	{
		title: "image with auto-numbering and ID",
		input: `![My image {#fig:img1}](http://example.com/test.png)\n\nLook at [](#fig:img1).`,
		output: `<figure id="fig:img1"><img src="http://example.com/test.png" alt="My image"><figcaption>Figure 1: My image</figcaption></figure>\n<p>Look at <a href="#fig:img1">Figure 1</a>.</p>`,
		options: { autoNumber: true }
	},
	{
		title: "table with auto-numbering and ID",
		input: `Table: My table {#tbl:tab1}\n\n| a |\n|---|\n| 1 |\n\nLook at [](#tbl:tab1).`,
		output: `<figure id="tbl:tab1"><table>\n<thead>\n<tr>\n<th>a</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>1</td>\n</tr>\n</tbody>\n</table><figcaption>Table 1: My table</figcaption></figure>\n<p>Look at <a href="#tbl:tab1">Table 1</a>.</p>`,
		options: { autoNumber: true }
	},
	{
		title: "cross-reference with custom text",
		input: `![My image {#fig:img2}](http://example.com/test.png)\n\nLook at [this cool image](#fig:img2).`,
		output: `<figure id="fig:img2"><img src="http://example.com/test.png" alt="My image"><figcaption>Figure 1: My image</figcaption></figure>\n<p>Look at <a href="#fig:img2">this cool image</a>.</p>`,
		options: { autoNumber: true }
	}
];

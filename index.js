// ESM port of https://github.com/tkhquang/gridsome-remark-figure-caption
import { visit } from "unist-util-visit";
import { whitespace } from "hast-util-whitespace";
import { remove } from "unist-util-remove";
import { fromMarkdown } from "mdast-util-from-markdown";

/** @type {import("unified").Plugin<[], import("mdast").Root>} */
export default function remarkFigureCaption(options = {}) {
	const autoNumber = options.autoNumber || false;
	const figurePrefix = options.figurePrefix || "Figure ";
	const tablePrefix = options.tablePrefix || "Table ";

	return (tree) => {
		let figureCount = 1;
		let tableCount = 1;
		const idMap = {};

		// Unwrap the images inside Paragraphs
		visit(tree, "paragraph", (node, index, parent) => {
			if (!hasOnlyImages(node)) {
				return;
			}

			remove(node, "text");

			parent.children.splice(index, 1, ...node.children);

			return index;
		});

		// Wrap image nodes in figure
		visit(
			tree,
			(node) => isImageWithAlt(node),
			(node, index, parent) => {
				if (isImageWithCaption(parent) || isImageLink(parent)) {
					return;
				}

				let figId = null;
				if (node.alt) {
					const altMatch = node.alt.match(/\{#([^}]+)\}$/);
					if (altMatch) {
						figId = altMatch[1];
						node.alt = node.alt.replace(/\s*\{#([^}]+)\}$/, "");
					}
				}

				const figure = createNodes(node, options);

				const label = figurePrefix + figureCount;
				figureCount++;
				if (figId) idMap[figId] = label;

				if (autoNumber) {
					if (!figure.children[1].children) figure.children[1].children = [];
					figure.children[1].children.unshift({ type: "text", value: label + ": " });
				}

				if (figId) {
					figure.data = figure.data || {};
					figure.data.hProperties = figure.data.hProperties || {};
					figure.data.hProperties.id = figId;
				}

				node.type = figure.type;
				node.children = figure.children;
				node.data = figure.data;
			}
		);

		// Wrap table nodes in figure
		visit(
			tree,
			"table",
			(node, index, parent) => {
				if (isTableWithCaption(parent)) {
					return;
				}

				let captionParagraph = null;
				let captionIndex = -1;

				if (index > 0 && isCaptionParagraph(parent.children[index - 1])) {
					captionParagraph = parent.children[index - 1];
					captionIndex = index - 1;
				} else if (index < parent.children.length - 1 && isCaptionParagraph(parent.children[index + 1])) {
					captionParagraph = parent.children[index + 1];
					captionIndex = index + 1;
				}

				if (captionParagraph) {
					const captionChildren = extractCaptionChildren(captionParagraph);

					let figId = null;
					if (captionChildren.length > 0) {
						const lastChild = captionChildren[captionChildren.length - 1];
						if (lastChild.type === "text") {
							const idMatch = lastChild.value.match(/\{#([^}]+)\}$/);
							if (idMatch) {
								figId = idMatch[1];
								lastChild.value = lastChild.value.replace(/\s*\{#([^}]+)\}$/, "");
								if (lastChild.value === "") {
									captionChildren.pop();
								}
							}
						}
					}

					const label = tablePrefix + tableCount;
					tableCount++;
					if (figId) idMap[figId] = label;

					if (autoNumber) {
						captionChildren.unshift({ type: "text", value: label + ": " });
					}

					const figcaption = {
						type: "figcaption",
						children: captionChildren,
						data: {
							hName: "figcaption",
							...getClassProp(options.captionClassName),
						},
					};

					const tableNode = { ...node }; // Clone node to prevent circular reference

					const figure = {
						type: "figure",
						children: [tableNode, figcaption],
						data: {
							hName: "figure",
							...getClassProp(options.figureClassName),
						},
					};

					if (figId) {
						figure.data = figure.data || {};
						figure.data.hProperties = figure.data.hProperties || {};
						figure.data.hProperties.id = figId;
					}

					node.type = figure.type;
					node.children = figure.children;
					node.data = figure.data;

					parent.children.splice(captionIndex, 1);

					// Adjust the index so visit continues correctly
					return captionIndex < index ? index : index + 1;
				}
			}
		);

		// Second pass for cross-references
		visit(tree, "link", (node) => {
			if (node.url && node.url.startsWith("#")) {
				const id = node.url.slice(1);
				if (idMap[id]) {
					if (!node.children || node.children.length === 0) {
						node.children = [{ type: "text", value: idMap[id] }];
					}
				}
			}
		});
	};
}

const createNodes = (imageNode, { figureClassName, imageClassName, captionClassName }) => {
	let figchildren = null;
	try {
		figchildren = fromMarkdown(imageNode.alt).children.flatMap(node => node.children);
	} catch (e) {
		console.log(`figure-caption-plugin: Failed to parse image alt-text as markdown - using raw value as fallback: ${imageNode.alt}`);
		figchildren = [
			{
				type: "text",
				value: imageNode.alt,
			},
		];
	}

	const figcaption = {
		type: "figcaption",
		children: figchildren,
		data: {
			hName: "figcaption",
			...getClassProp(captionClassName),
		},
	};

	const figure = {
		type: "figure",
		children: [getImageNodeWithClasses(imageNode, imageClassName), figcaption],
		data: {
			hName: "figure",
			...getClassProp(figureClassName),
		},
	};

	return figure;
};

const hasOnlyImages = (node) => {
	return node.children.every((child) => {
		return child.type === "image" || whitespace(child);
	});
};

const isImageNodeWithAlt = (node) => {
	return node.type === "image" && Boolean(node.alt) && Boolean(node.url);
};

const isHTMLImageNode = (node) => {
	return node.type === "html" && Boolean(node.alt) && /^<img\s/.test(node.value);
};

const isImageWithAlt = (node) => {
	return isImageNodeWithAlt(node) || isHTMLImageNode(node);
};

const isImageWithCaption = (parent) => {
	return (
		parent.type === "figure" &&
		parent.children.some((child) => child.type === "figcaption")
	);
};

const isTableWithCaption = (parent) => {
	return (
		parent.type === "figure" &&
		parent.children.some((child) => child.type === "figcaption")
	);
};

const captionPrefixRegex = /^((?:[Tt]able)?:)\s*/;

const isCaptionParagraph = (node) => {
	if (node.type !== "paragraph" || !node.children || node.children.length === 0) {
		return false;
	}
	const firstChild = node.children[0];
	if (firstChild.type === "text" && captionPrefixRegex.test(firstChild.value)) {
		return true;
	}
	return false;
};

const extractCaptionChildren = (paragraphNode) => {
	// Deep copy to avoid mutating the original safely
	const children = JSON.parse(JSON.stringify(paragraphNode.children));
	const firstChild = children[0];
	firstChild.value = firstChild.value.replace(captionPrefixRegex, "");
	if (firstChild.value === "" && children.length > 1) {
		children.shift();
	}
	return children;
};

const isImageLink = (parent) => {
	return (parent.type === "link");
};

const getClassProp = (className) => {
	return {
		...(className && {
			hProperties: {
				class: [className],
			},
		}),
	};
};

const classRegex = /\sclass="(.*?)"\s/gi;

const getImageNodeWithClasses = (node, classes) => {
	// Is Image type node
	if (!isHTMLImageNode(node)) {
		return {
			...node,
			data: {
				...getClassProp(classes),
			},
		};
	}

	// is HTML Image node
	if (!classes) {
		return {
			...node,
		};
	}

	// Bruteforce adding classes for now
	const hasClass = classRegex.exec(node.value);

	if (!hasClass) {
		return {
			...node,
			value: node.value.replace(/<img\s/, `<img class="${classes}" `),
		};
	}

	return {
		...node,
		value: node.value.replace(classRegex, ` class="$1 ${classes}" `),
	};
};

const ALLOW_TAG = ['div', 'section', 'article', 'p', 'span', 'a', 'ul', 'li', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'table', 'tr', 'td', 'th', 'thead', 'tbody', 'tfoot', 'caption', 'colgroup', 'col', 'label', 'header', 'footer', 'nav', 'main', 'aside', 'article', 'details', 'summary', 'head', 'body', 'html', 'address', 'blockquote', 'pre', 'code',];

const createTagPath = (node) => {
	let out = node.tagName.toLowerCase();

	if (node.id) {
		out += `#${node.id}`;
	}
	if (node.className) {
		const classStr = node.className.split(' ').join('.');
		out += `.${classStr}`;
	}

	return out;
};

const traverse = (node) => {
	const elementPath = [];

	let { children } = node;
	
	// convert children to array
	children = Array.from(children);

	// Filter children by ALLOW_TAG
	children = children.filter((child) => ALLOW_TAG.includes(child.tagName.toLowerCase()));

	if (children.length === 0) {
		elementPath.push({
			path: createTagPath(node),
			child: []
		})
		return elementPath;
	}

	for (childNode of children) {
		elementPath.push({
			path: createTagPath(node),
			child: traverse(childNode)
		});
	}

	return elementPath;
};

const getStructure = (root) => {
	const structure = traverse(root);
	return structure;
}

console.log(getStructure(document.querySelector('#experience')));

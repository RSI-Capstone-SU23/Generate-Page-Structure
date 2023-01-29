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
	let { children } = node;
	
	// convert children to array
	children = Array.from(children);
	
	// Filter children by ALLOW_TAG
	children = children.filter((child) => ALLOW_TAG.includes(child.tagName.toLowerCase()));

	const child = [];
	
	for (childNode of children) {
		child.push(traverse(childNode));
	}

	return { path: createTagPath(node), child };
};

const getStructure = (root) => {
	const structure = traverse(root);
	return structure;
}

console.log(getStructure(document.querySelector('.timeline.other')));

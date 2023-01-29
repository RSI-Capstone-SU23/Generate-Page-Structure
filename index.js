
const ALLOW_TAG = ['div', 'section', 'article', 'p', 'span', 'a', 'ul', 'li', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'table', 'tr', 'td', 'th', 'thead', 'tbody', 'tfoot', 'caption', 'colgroup', 'col', 'label', 'header', 'footer', 'nav', 'main', 'aside', 'article', 'details', 'summary', 'head', 'body', 'html', 'address', 'blockquote', 'pre', 'code',];

const traverse = (node, element) => {

};

const getStructure = (root) => {
	const structure = [];
	const traverse = (node, path) => {
		if (node.children.length === 0) {
			structure.push(path);
		} else {
			for (let i = 0; i < node.children.length; i++) {
				traverse(node.children[i], path + ' > ' + node.children[i].tagName);
			}
		}
	};

	traverse(root, root.tagName);

	// return last element of the array
	return structure.pop();
}

console.log(getStructure(document.body));

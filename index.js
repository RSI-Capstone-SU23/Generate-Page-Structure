const ALLOW_TAG = ['div', 'section', 'article', 'p', 'span', 'a', 'ul', 'li', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'table', 'tr', 'td', 'th', 'thead', 'tbody', 'tfoot', 'caption', 'colgroup', 'col', 'label', 'header', 'footer', 'nav', 'main', 'aside', 'article', 'details', 'summary', 'head', 'body', 'html', 'address', 'blockquote', 'pre', 'code',];

const createTagPath = (node) => {
	let out = node.tagName.toLowerCase();

	if (node.id) {
		out += `#${node.id}`;
	}
	else if (node.className) {
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

const removeDuplicate = (node) => {
	const { child } = node;
	const pathSet = new Set();
	const newChild = [];

	for (childNode of child) {
		const { path } = childNode;
		if (!pathSet.has(path)) {
			pathSet.add(path);
			newChild.push(childNode);
		}
	}

	node.child = newChild;
	
	for (childNode of node.child) {
		removeDuplicate(childNode);
	}
};

// dfs structure, if node is leaf then group that node with its parent
// newPath = parrentPath + " >> " + nodePath
const dfs = (node) => {
	let { child, parent } = node;

	for (childNode of child) {
		dfs(childNode);
	}

	if (child.length === 0 && parent && parent.child.length == 1) {
		// leaf node
		parent.path += ` >> ${node.path}`;
		parent.child = [];

		dfs(parent)
	}
};

const addParentToNode = (node) => {
	const { child } = node;

	for (childNode of child) {
		childNode.parent = node;
		addParentToNode(childNode);
	}
}

const getStructure = (root) => {
	// Step 1: Traverse the DOM
	let structure = traverse(root);

	// Step 2: Remove duplicate path in child (keep the first one)
	removeDuplicate(structure);

	// Step 3: Add parrent to each node
	addParentToNode(structure);

	// Step 4: dfs structure, if node is leaf then group that node with its parent
	dfs(structure);

	return structure;
}

// Example
document.querySelectorAll('.timeline.other span.time').forEach((node) => node.remove());

const structure = getStructure(document.querySelector('.timeline.other'));
const printStructure = (node) => {
	// Remove all parrent in each node of structure
	const removeParent = (node) => {
		delete node.parent;
		for (child of node.child) {
			removeParent(child);
		}
	}

	removeParent(node);
	console.log(node);
};

printStructure(structure);

const ALLOW_TAG = ['div', 'section', 'article', 'p', 'span', 'a', 'ul', 'li', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'table', 'tr', 'td', 'th', 'thead', 'tbody', 'tfoot', 'caption', 'colgroup', 'col', 'label', 'header', 'footer', 'nav', 'main', 'aside', 'article', 'details', 'summary', 'head', 'body', 'html', 'address', 'blockquote', 'pre', 'code',];
const CONTAINER_TAG = ['div', 'section', 'article', 'ul', 'ol', 'img', 'table', 'header', 'footer', 'nav', 'main', 'aside', 'article', 'details', 'summary', 'body', 'html', 'address', ];
const INDENT_SIZE = 4;

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

let output = '';
const convertToStr = (node, indent) => {
	output += `\r\n${ indent }${ node.path}`;

	for(const childEl of node.child) {
		convertToStr(childEl, indent + ' '.repeat(INDENT_SIZE));
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

	// Step 5: Convert to string
	convertToStr(structure, '');

	output = output.trim();

	return output;
};

// Add event listener to CONTAINER_TAG element
for (const tag of CONTAINER_TAG) {
	const elements = document.getElementsByTagName(tag);

	for (const el of elements) {
		el.addEventListener('click', (e) => {
			e.stopPropagation();
			const structure = getStructure(el);
			
			// copy to clipboard and overwrite
			// navigator.clipboard.writeText(structure);
			// // show alert
			// alert('Copied to clipboard');

			alert(structure);
		});

		// add hover event and add red border
		// if unhover then remove border
		el.addEventListener('mouseover', (e) => {
			e.stopPropagation();
			el.style.border = '1px solid red';
		});

		el.addEventListener('mouseout', (e) => {
			e.stopPropagation();
			el.style.border = '';
		});
	}
}

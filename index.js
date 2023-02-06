javascript:(function () {
	const ALLOW_TAG = ['div', 'section', 'article', 'p', 'span', 'a', 'ul', 'li', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'table', 'tr', 'td', 'th', 'thead', 'tbody', 'tfoot', 'caption', 'colgroup', 'col', 'label', 'header', 'footer', 'nav', 'main', 'aside', 'article', 'details', 'summary', 'head', 'body', 'html', 'address', 'blockquote', 'pre', 'code'];
	const CONTAINER_TAG = ['div', 'section', 'article', 'ul', 'ol', 'img', 'table', 'header', 'footer', 'nav', 'main', 'aside', 'article', 'details', 'summary', 'body', 'html', 'address'];
	const INDENT_SIZE = 4;

	const createTagPath = (node) => {
		let out = node.tagName.toLowerCase();

		if (node.id) {
			out += `#${node.id}`;
		} else if (node.className) {
			const classStr = node.className.split(' ').join('.');
			out += `.${classStr}`;
		}

		return out;
	};

	const traverse = (node) => {
		let {
			children
		} = node;

		children = Array.from(children);
		children = children.filter((child) => ALLOW_TAG.includes(child.tagName.toLowerCase()));

		const child = [];

		for (childNode of children) {
			child.push(traverse(childNode));
		}

		return {
			path: createTagPath(node),
			child
		};
	};

	const removeDuplicate = (node) => {
		const {
			child
		} = node;
		const pathSet = new Set();
		const newChild = [];

		for (childNode of child) {
			const {
				path
			} = childNode;
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

	const dfs = (node) => {
		let {
			child,
			parent
		} = node;

		for (childNode of child) {
			dfs(childNode);
		}

		if (child.length === 0 && parent && parent.child.length == 1) {
			parent.path += ` >> ${node.path}`;
			parent.child = [];

			dfs(parent)
		}
	};

	const addParentToNode = (node) => {
		const {
			child
		} = node;

		for (childNode of child) {
			childNode.parent = node;
			addParentToNode(childNode);
		}
	};

	let output = '';
	const convertToStr = (node, indent) => {
		output += `\r\n${ indent }${ node.path}`;

		for (const childEl of node.child) {
			convertToStr(childEl, indent + ' '.repeat(INDENT_SIZE));
		}
	};

	const getStructure = (root) => {
		let structure = traverse(root);

		removeDuplicate(structure);
		addParentToNode(structure);
		dfs(structure);
		convertToStr(structure, '');

		output = output.trim();

		return output;
	};


	for (const tag of CONTAINER_TAG) {
		const elements = document.getElementsByTagName(tag);

		for (const el of elements) {
			el.addEventListener('click', (e) => {
				e.stopPropagation();
				const structure = getStructure(el);

				navigator.clipboard.writeText(structure);
				console.log('-----------------');
				console.log(structure);

				alert('Copied to clipboard, check console for more detail');
			});

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

	alert('Script loaded');
})();

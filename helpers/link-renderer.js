import { isHttpUrl, LinksRegExpString } from './links-parse';

// eslint-disable-next-line max-len
// https://alex7kom.github.io/nano-nanoid-cc/?alphabet=bjectSymhasOwnProp-0123456789ABCDEFGHIJKLMNQRTUVWXYZ_dfgiklquvxz%0A&size=6&speed=100&speedUnit=second
function nanoid(size = 21) {
	const url = 'bjectSymhasOwnProp-0123456789ABCDEFGHIJKLMNQRTUVWXYZ_dfgiklquvxz';
	let id = '';
	while (0 < size--) {
		id += url[Math.random() * 64 | 0];
	}
	return id;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function escapeHtml(string) {
	const htmlEscapes = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		'\'': '&#x27;',
		'/': '&#x2F;'
	};
	const htmlEscaper = /[&<>"'/]/g;

	// eslint-disable-next-line prefer-template
	return ('' + string).replace(htmlEscaper, (match) => {
		return htmlEscapes[match];
	});
}

export class LinkRenderer {
	constructor(appHostname) {
		this.appHostname = appHostname;
	}

	_replaceWithHyperlink(content, isHtml) {
		const links = content.match(new RegExp(LinksRegExpString, 'ig')) || [];
		const markers = [];
		links.forEach(link => {
			if (!isHttpUrl(link)) return; // real url validation, regex is just to extract texts

			const anUrl = new URL(link);
			const target = (anUrl.hostname === this.appHostname) ? '_parent' : '_blank'; // open lms links on same tab
			const marker = {
				link,
				placeholder: `[%${nanoid(6)}%]`, // unique id
				replacement: `<a href="${link}" target="${target}">${link}</a>`
			};
			const flags = 'i';
			const replaceRegExp = new RegExp(`${escapeRegExp(link)}`, flags);
			content = content.replace(replaceRegExp, marker.placeholder); // mark link position with a unique placeholder
			markers.push(marker);
		});

		if (isHtml) {
			content = escapeHtml(content); // html escape the non-url content
		}
		markers.forEach(({placeholder, replacement}) => {
			content = content.replace(placeholder, replacement); // now fill in the hyperlink anchor tags
		});
		return content;
	}

	renderText(messageText) {
		return this._replaceWithHyperlink(messageText, false);
	}

	renderHTML(message) {
		const domData = (new window.DOMParser()).parseFromString(message, 'text/html');
		const template = domData.createElement('template');

		const treeWalker = domData.createTreeWalker(domData.body, NodeFilter.SHOW_TEXT,  {
			acceptNode: ({textContent}) => {
				return new RegExp(LinksRegExpString, 'ig').test(textContent) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP; }
		});

		const nodeList = [];
		while (treeWalker.nextNode()) nodeList.push(treeWalker.currentNode);

		nodeList.forEach(node => {
			template.innerHTML = this._replaceWithHyperlink(node.textContent, true);
			node.replaceWith(...template.content.childNodes);
		});

		return domData.body.innerHTML;
	}
}

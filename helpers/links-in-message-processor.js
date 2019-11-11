import { isHttpUrl, LinksRegExpString } from './links-parse';

export class LinksInMessageProcessor {
	constructor() {
		this._trackUrls = new Set();
	}
	init(links = []) {
		this._trackUrls = new Set(links);
	}
	_trackLink(attachment, newAttachments) {
		const link = attachment.url;
		if (![link, `${link}/`].some(x => this._trackUrls.has(x))) {
			newAttachments.push(attachment);
			this._trackUrls.add(link);
		}
	}
	_getTreewalker(message) {
		const domData = (new window.DOMParser()).parseFromString(message, 'text/html');
		const treeWalker = domData.createTreeWalker(domData.body, NodeFilter.SHOW_ALL,  {
			acceptNode: ({nodeType, nodeName, textContent, src}) => {
				if (nodeType === Node.TEXT_NODE) {
					return new RegExp(LinksRegExpString, 'ig').test(textContent) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
				}
				if (nodeType === Node.ELEMENT_NODE && nodeName === 'IFRAME' && !!src) {
					return NodeFilter.FILTER_ACCEPT;
				}
				return NodeFilter.FILTER_SKIP;
			}
		});
		return treeWalker;
	}
	process(message, onNewLinkAttachments) {
		const treeWalker = this._getTreewalker(message);
		const newAttachments = [];
		const nodeList = [];
		while (treeWalker.nextNode()) {
			const currentNode = treeWalker.currentNode;
			if (currentNode.nodeName === 'IFRAME') { // just get link from src for iframe nodes
				const link = currentNode.src;
				this._trackLink({ url: link, embed: currentNode.outerHTML }, newAttachments);
			} else {
				nodeList.push(currentNode); // text node to be processed
			}
		}
		nodeList.forEach(node => {
			const iframeStrings = node.textContent.match(/<iframe.*?>[^]*?<\/iframe>/ig) || [];
			iframeStrings.forEach(iframeString => {
				const srcMatch = iframeString.match(/src=["']([^"']+)/i); // match iframe src
				const link = srcMatch && srcMatch.length === 2 && srcMatch[1];

				if (!isHttpUrl(link)) return; // real url validation, regex is just to extract texts
				this._trackLink({ url: link, embed: iframeString }, newAttachments);
			});
			const links = node.textContent.match(new RegExp(LinksRegExpString, 'ig')) || [];
			links.forEach(link => {
				if (!isHttpUrl(link)) return; // real url validation, regex is just to extract texts
				this._trackLink({ url: link }, newAttachments);
			});
		});

		if (newAttachments.length > 0 && onNewLinkAttachments) {
			onNewLinkAttachments(newAttachments);
		}
	}
}

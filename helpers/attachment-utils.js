/* eslint-disable no-useless-escape */

// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License

function parseUri(str) {
	const o = parseUri.options;
	const m = o.parser[o.strictMode ? 'strict' : 'loose'].exec(str);
	const uri = {};
	let i = 14;

	while (i > 0) {
		uri[o.key[i]] = m[i] || '';
		i -= 1;
	}

	uri[o.q.name] = {};
	uri[o.key[12]].replace(o.q.parser, ($0, $1, $2) => {
		if ($1) uri[o.q.name][$1] = $2;
	});

	return uri;
}

parseUri.options = {
	strictMode: true,
	key: [
		'source',
		'protocol',
		'authority',
		'userInfo',
		'user',
		'password',
		'host',
		'port',
		'relative',
		'path',
		'directory',
		'file',
		'query',
		'anchor',
	],
	q: {
		name: 'queryKey',
		parser: /(?:^|&)([^&=]*)=?([^&]*)/g,
	},
	parser: {
		strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
		loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
	},
};

const imageMediaTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/gif'];
const imageExtensions = ['jpg', 'jpeg', 'png', 'bmp', 'gif'];

export function hasExtension(path, extensions) {
	if (!path) {
		return false;
	}
	const indexOfExtension = path.lastIndexOf('.');
	const pathExtension =
		indexOfExtension > -1 ? path.substr(indexOfExtension + 1).toLowerCase() : null;
	return extensions.some(extension => extension === pathExtension);
}

export function defaultLink(url, rels = ['self', 'alternate']) {
	function hasRel(rel) {
		return function hasRelInner(urlToCheck) {
			return urlToCheck.rel && urlToCheck.rel.some(r => r === rel);
		};
	}

	let link;
	for (let i = 0; i < rels.length && !link; i += 1) {
		link = url.find(hasRel(rels[i]));
	}

	if (!link) {
		link = url.find(x => !x.rel || x.rel.length === 0);
	}
	if (!link) {
		link =
			url.length > 0
				? url[0]
				: { href: '' };
	}
	return link;
}

export function normalizeAttachmentUrl(obj) {
	if (!obj || !obj.url) {
		return [
			{
				href: '',
			},
		];
	}

	let _url = Array.isArray(obj.urls) ? obj.urls : null;
	if (!_url) {
		_url = Array.isArray(obj.url) ? obj.url : [obj.url];
	}

	// Convert strings to Links
	_url = _url.map(link => {
		if (typeof link === 'string') {
			return {
				href: link,
			};
		}
		return link;
	});
	return _url;
}

export function parseDomainFromUrl(url) {
	if (!url) {
		return '';
	}

	let domain;
	if (url.indexOf('://') > -1) {
		[, , domain] = url.split('/');
	} else {
		[domain] = url.split('/');
	}
	return domain.split(':')[0];
}

export function detectImage(attachment) {
	let imageLink = attachment.url.find(link =>
		imageMediaTypes.some(mimeType => mimeType === link.mediaType),
	);
	if (imageLink) {
		return {
			type: 'image',
			url: imageLink.href,
		};
	}

	imageLink = defaultLink(attachment.url);
	if (imageLink && hasExtension(parseUri(imageLink.href).file, imageExtensions)) {
		return {
			type: 'image',
			url: imageLink.href,
		};
	}
	return null;
}

function detectVideo(attachment) {
	if (attachment.type !== 'Video') {
		return null;
	}
	const embedLink = (attachment.url || []).filter(
		x => x.rel && x.rel.some(r => r === 'alternate'),
	)[0];
	const thumbnailLink = (attachment.url || []).filter(
		x => x.rel && x.rel.some(r => r === 'icon'),
	)[0];
	if (!embedLink || !thumbnailLink) {
		return null;
	}
	return {
		type: 'video',
		embedUrl: embedLink.href,
		thumbnailUrl: thumbnailLink.href,
		url: defaultLink(attachment.url).href,
	};
}

function detectEmbed(attachment) {
	if (!attachment.embed) {
		return null;
	}

	return {
		type: 'embed',
		embedUrl: defaultLink(attachment.url).href,
		url: defaultLink(attachment.url).href,
	};
}

async function callUnfurl(endpoint, url) {
	if (!endpoint) {
		return {
			url
		};
	}

	const request = new Request(`${endpoint}/${encodeURIComponent(url)}`);
	try {
		const response = await window.d2lfetch.fetch(request);
		const body = await response.json();
		if (body && body.properties) {
			return {
				embedUrl: body.properties.embedUrl,
				providerUrl: body.properties.providerUrl,
				thumbnailUrl: body.properties.thumbnailUrl,
				description: body.properties.description,
				favicon: body.properties.favicon,
				title: body.properties.title ? body.properties.title : body.properties.url,
				type: body.properties.type,
				url,
			};
		}
	} catch {
		return {
			url,
		};
	}

	return null;
}

export async function unfurl(endpoint, checkTrustedFn, attachment) {
	let detected = detectVideo(attachment);

	if (!detected) {
		detected = detectEmbed(attachment);
	}

	let result = detected;
	let unfurled;
	if (!attachment.name || !detected) {
		unfurled = await callUnfurl(endpoint, defaultLink(attachment.url).href);
		result = {
			...unfurled,
			...detected,
		};
	}

	if (result.type === 'video' && (!result.embedUrl || !result.thumbnailUrl)) {
		result.type = 'website';
	}

	if (result.type === 'video' || result.type === 'embed') {
		const trusted = await checkTrustedFn(result.url);
		if (!trusted) {
			if (!unfurled) {
				result = await callUnfurl(endpoint, defaultLink(attachment.url).href);
			}
			result.type = 'website';
		}
	}

	return result;
}

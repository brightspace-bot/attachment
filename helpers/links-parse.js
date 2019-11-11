// https://github.com/kevva/url-regex/blob/master/index.js
// eslint-disable-next-line max-len
export const LinksRegExpString = /(?:(?:(?:[a-z]+:)?\/\/)|www\.)(?:\S+(?::\S*)?@)?(?:localhost|(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?:(?:[a-z\u00a1-\uffff0-9][-_]*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#][^\s"]*)?/.source;

export const isHttpUrl = string => {
	try {
		return Boolean(new URL(string).protocol.match(/^http:|https:$/));
	}
	catch (e) {
		return false;
	}
};

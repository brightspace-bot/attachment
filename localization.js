import { resolveUrl } from '@polymer/polymer/lib/utils/resolve-url.js';

const SUPPORTED_LANGUAGES = ['ar-sa', 'ar', 'da-dk', 'da', 'de-de', 'de', 'en-ca', 'en-gb', 'en-us', 'en',
	'es-mx', 'es', 'fi-fl', 'fi', 'fr-ca', 'fr-fr', 'fr', 'ja-jp', 'ja', 'ko-kr', 'ko', 'nb-no', 'nb',
	'nl-nl', 'nl', 'pt-br', 'pt', 'sv-se', 'sv', 'tr-tr', 'tr', 'zh-cn', 'zh-tw', 'zh'];

const cache = {};

export async function getLocalizeResources(langs, baseUrl) {
	const supportedLanguages = langs.reverse().filter(language => {
		return SUPPORTED_LANGUAGES.indexOf(language) > -1;
	});

	const sergeLangterms = supportedLanguages.map(language => {
		const url = resolveUrl(`./locales/${language}.json`, baseUrl);
		if (cache[url]) {
			return cache[url];
		}

		const langterms = fetch(url).then(res => res.json()).then(json => {
			const langterms = {};
			for (const langterm in json) {
				// langterms[langterm] = json[langterm].translation;
				langterms[langterm] = json[langterm];
			}
			return langterms;
		});
		cache[url] = langterms;
		return langterms;
	});

	const responses = await Promise.all(sergeLangterms);

	const langterms = {};
	responses.forEach(language => {
		Object.assign(langterms, language);
	});

	return {
		language: supportedLanguages[supportedLanguages.length - 1],
		resources: langterms
	};
}

import { getLocalizeResources } from './localization.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
import { resolveUrl } from '@polymer/polymer/lib/utils/resolve-url.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';

const baseUrl = import.meta.url;

export const BaseMixin = superclass =>
	class extends LocalizeMixin(RtlMixin(superclass)) {
		static async getLocalizeResources(langs) {
			return getLocalizeResources(langs, baseUrl);
		}

		static resolveUrl(url) {
			return resolveUrl(url, baseUrl);
		}
	};

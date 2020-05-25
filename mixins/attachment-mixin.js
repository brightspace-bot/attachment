import { RequestProviderMixin } from './request-provider-mixin.js';

export const AttachmentMixin = superclass => class extends RequestProviderMixin(superclass) {
	static get properties() {
		return {
			baseHref: { type: String },
		};
	}

	async focus() {
		const infoView = this.shadowRoot.querySelector('d2l-labs-attachment-view-info');
		if (infoView) {
			infoView.focus();
		}
	}

	resolveHref(href) {
		if (href) {
			const orgUnitId = this.requestProvider('d2l-provider-org-unit-id');
			href = orgUnitId ? this._replaceStrings(href, 'orgUnitId', orgUnitId) : href;
		}
		if (href && this.baseHref && href[0] === '/') {
			return this.baseHref + href.substring(1);
		}
		return href;
	}

	_replaceStrings(str, replacementToken, replacementValue) {
		if (!str) {
			return str;
		}
		const regEx = new RegExp(`{${replacementToken}}`, 'i');
		return str.replace(regEx, replacementValue);
	}
};

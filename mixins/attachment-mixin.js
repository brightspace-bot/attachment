export const AttachmentMixin = superclass => class extends superclass {
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
		if (href && this.baseHref && href[0] === '/') {
			return this.baseHref + href.substring(1);
		}
		return href;
	}
};

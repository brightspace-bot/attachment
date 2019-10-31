export const AttachmentMixin = superclass => class extends superclass {
	focus() {
		const infoView = this.shadowRoot.querySelector('d2l-labs-attachment-view-info');
		if (infoView) {
			infoView.focus();
		}
	}
};

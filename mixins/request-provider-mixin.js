
export const RequestProviderMixin = superclass => class extends superclass {

	requestProvider(key) {
		const event = new CustomEvent('d2l-request-provider', {
			detail: { key },
			bubbles: true,
			composed: true,
			cancelable: true
		});

		this.dispatchEvent(event);
		return event.detail.provider;
	}
};

import { css, html, LitElement } from 'lit-element';

import { ProviderMixin } from '../mixins/provider-mixin.js';

export class StubUnfurlProvider extends ProviderMixin(LitElement) {
	static get properties() {
		return {
			endpoint: { type: String },
			trusted: { type: Boolean },
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
		`;
	}

	set endpoint(value) {
		this.provide('d2l-provider-unfurl-api-endpoint', () => value);
	}

	set trusted(value) {
		this.provide('d2l-provider-trusted-site-fn', () => () => value);
	}

	render() {
		return html`
			<slot></slot>
		`;
	}
}

window.customElements.define('d2l-stub-unfurl-provider', StubUnfurlProvider);

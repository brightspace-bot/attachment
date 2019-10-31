import './attachment-opener.js';
import './views/attachment-view-iconlink.js';
import './views/attachment-view-imagelink.js';
import './views/attachment-view-info.js';
import { css, html, LitElement } from 'lit-element';
import { AttachmentMixin } from '../mixins/attachment-mixin.js';
import { BaseMixin } from '../mixins/base-mixin.js';
import { parseDomainFromUrl } from '../helpers/attachment-utils.js';

export class AttachmentUrl extends AttachmentMixin(BaseMixin(LitElement)) {
	static get properties() {
		return {
			attachment: { type: Object },
			unfurlResult: { type: Object },
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
		`;
	}

	get unfurlResult() {
		return this._unfurlResult;
	}

	set unfurlResult(value) {
		const oldValue = this._unfurlResult;
		if (oldValue === value) {
			return;
		}
		this._unfurlResult = value;
		this._hasThumbnail = !!this._unfurlResult.thumbnailUrl;

		this.requestUpdate('unfurlResult', oldValue);
	}

	get _label() {
		return this.unfurlResult.providerUrl
			? this.unfurlResult.providerUrl
			: parseDomainFromUrl(this.unfurlResult.url);
	}

	get _name() {
		return this.attachment.name || this.unfurlResult.title || this.unfurlResult.url;
	}

	get _infoTemplate() {
		return html`
			<d2l-labs-attachment-view-info
				.name="${this._name}"
				.description="${this.unfurlResult.description}"
				href="${this.unfurlResult.url}"
				target="_blank"
				.label="${this._label}"
			>
				<slot name="button" slot="button"></slot>
			</d2l-labs-attachment-view-info>
		`;
	}

	get _iconLinkTemplate() {
		return html`
			<d2l-labs-attachment-view-iconlink .src="${this.unfurlResult.favicon}" icon="link">
				${this._infoTemplate}
			</d2l-labs-attachment-view-iconlink>
		`;
	}

	get _imageLinkTemplate() {
		return html`
			<d2l-labs-attachment-view-imagelink
				@error="${this._thumbnailErrored}"
				.src="${this.unfurlResult.thumbnailUrl}"
			>
				${this._infoTemplate}
			</d2l-labs-attachment-view-imagelink>
		`;
	}

	_thumbnailErrored() {
		this._hasThumbnail = false;
		this.requestUpdate('_hasThumbnail', true);
	}

	render() {
		return html`
			<d2l-labs-attachment-opener url="${this.unfurlResult.url}">
				${this._hasThumbnail ? this._imageLinkTemplate : this._iconLinkTemplate}
			</d2l-labs-attachment-opener>
		`;
	}
}

window.customElements.define('d2l-labs-attachment-url', AttachmentUrl);

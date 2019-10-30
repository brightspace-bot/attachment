import './attachment-opener.js';
import './views/attachment-view-info.js';
import { css, html, LitElement } from 'lit-element';
import { BaseMixin } from '../mixins/base-mixin.js';
import { parseDomainFromUrl } from '../helpers/attachment-utils.js';

export class AttachmentVideo extends BaseMixin(LitElement) {
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

	get _label() {
		return this.unfurlResult.providerUrl
			? this.unfurlResult.providerUrl
			: parseDomainFromUrl(this.unfurlResult.url);
	}

	get _name() {
		return this.attachment.name || this.unfurlResult.title || this.unfurlResult.url;
	}

	render() {
		return html`
			<d2l-labs-attachment-opener url="${this.unfurlResult.url}">
				<d2l-labs-attachment-view-video
					url="${this.unfurlResult.url}"
					src="${this.unfurlResult.embedUrl}"
					thumbnailUrl="${this.unfurlResult.thumbnailUrl}"
				>
					<d2l-labs-attachment-view-info
						.name="${this._name}"
						href="${this.unfurlResult.url}"
						target="_blank"
						.label="${this._label}"
					>
						<slot name="button" slot="button"></slot>
					</d2l-labs-attachment-view-info>
				</d2l-labs-attachment-view-video>
			</d2l-labs-attachment-opener>
		`;
	}
}

window.customElements.define('d2l-labs-attachment-video', AttachmentVideo);

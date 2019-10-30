import './attachment-opener.js';
import './attachment-view-info.js';
import './attachment-view-embed.js';
import { css, html, LitElement } from 'lit-element';
import { BaseMixin } from './base-mixin.js';

export class AttachmentEmbed extends BaseMixin(LitElement) {
	static get properties() {
		return {
			attachment: { type: Object },
			unfurlResult: { type: Object },
			immersive: { type: Boolean },
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
		`;
	}

	get _name() {
		return this.attachment.name || this.unfurlResult.title || this.unfurlResult.url;
	}

	render() {
		return html`
			<d2l-labs-attachment-opener url="${this.unfurlResult.url}">
				<d2l-labs-attachment-view-embed
					src="${this.unfurlResult.embedUrl}"
					?immersive="${this.immersive}"
				>
					<d2l-labs-attachment-view-info
						.name="${this._name}"
						href="${this.unfurlResult.url}"
						target="_blank"
						?immersive="${this.immersive}"
					>
						<slot name="button" slot="button"></slot>
					</d2l-labs-attachment-view-info>
				</d2l-labs-attachment-view-embed>
			</d2l-labs-attachment-opener>
		`;
	}
}

window.customElements.define('d2l-labs-attachment-embed', AttachmentEmbed);

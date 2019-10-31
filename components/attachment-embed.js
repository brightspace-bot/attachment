import './attachment-opener.js';
import './views/attachment-view-info.js';
import './views/attachment-view-embed.js';
import { css, html, LitElement } from 'lit-element';
import { AttachmentMixin } from '../mixins/attachment-mixin.js';
import { BaseMixin } from '../mixins/base-mixin.js';

export class AttachmentEmbed extends AttachmentMixin(BaseMixin(LitElement)) {
	static get properties() {
		return {
			attachment: { type: Object },
			unfurlResult: { type: Object },
			immersive: { type: Boolean },
			maxheight: { type: Number },
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
					maxheight="${this.maxheight}"
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

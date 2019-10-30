import './views/attachment-view-image.js';
import { css, html, LitElement } from 'lit-element';
import { BaseMixin } from '../mixins/base-mixin.js';
import { detectImage } from '../helpers/attachment-utils.js';

export class AttachmentImage extends BaseMixin(LitElement) {
	static get properties() {
		return {
			attachment: { type: Object },
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
		`;
	}

	static findLink(attachment) {
		const imageLink = detectImage(attachment);
		if (imageLink) {
			return imageLink;
		}
		return null;
	}

	static getTemplate(attachment) {
		if (AttachmentImage.findLink(attachment)) {
			return 'image';
		}
		return null;
	}

	get _src() {
		return AttachmentImage.findLink(this.attachment).url;
	}

	get _name() {
		return this.attachment.name;
	}

	render() {
		return html`
			<d2l-labs-attachment-view-image src="${this._src}" name="${this._name}">
				<slot name="button" slot="button"></slot>
			</d2l-labs-attachment-view-image>
		`;
	}
}

window.customElements.define('d2l-labs-attachment-image', AttachmentImage);

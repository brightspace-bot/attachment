import './views/attachment-view-info.js';
import './views/attachment-view-iconlink.js';
import './views/attachment-view-embed.js';
import './attachment-opener-secure.js';
import { css, html, LitElement } from 'lit-element';
import { AttachmentMixin } from '../mixins/attachment-mixin.js';
import { BaseMixin } from '../mixins/base-mixin.js';
import { defaultLink } from '../helpers/attachment-utils.js';

export class AttachmentLti extends AttachmentMixin(BaseMixin(LitElement)) {
	static get properties() {
		return {
			attachment: { type: Object },
			permission: { type: Object },
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

	static findLink(attachment) {
		const link = defaultLink(attachment.url, ['https://api.brightspace.com/rels/quicklink']);
		const aUrl = link && new URL(link.href, 'https://noop/'); // dummy base url to satisfy relative uri and full uri
		return aUrl && aUrl.pathname.match(/quickLink.d2l$/i) && aUrl.search.match(/type=lti/i)
			? link
			: null;
	}

	static getTemplate(attachment) {
		if (AttachmentLti.findLink(attachment)) {
			return 'lti';
		}
		return null;
	}

	constructor() {
		super();
		this._componentType = 'lti';
		this._target = '_blank';
	}

	get _label() {
		return !this._canOpen ? this.localize(this._componentType) : '';
	}

	get _href() {
		return AttachmentLti.findLink(this.attachment).href;
	}

	get _canOpen() {
		return this.permission.canAccess(this.attachment, this._componentType);
	}

	get _infoTemplate() {
		return html`
			<d2l-labs-attachment-view-info
				.name="${this.attachment.name}"
				.href="${this._href}"
				target="_blank"
				.canOpen="${this._canOpen}"
				label="${this._label}"
			>
				${this._canOpen ? html`
					<slot name="button" slot="button"></slot>
				` : html``}
			</d2l-labs-attachment-view-info>
		`;
	}

	get _iconLinkTemplate() {
		return html`
			<d2l-labs-attachment-view-iconlink icon="content" .canOpen="${this._canOpen}">
				${this._infoTemplate}
			</d2l-labs-attachment-view-iconlink>
		`;
	}

	get _embedTemplate() {
		return html`
			<d2l-labs-attachment-view-embed src="${this._href}" ?immersive="${this.immersive}">
				${this._infoTemplate}
			</d2l-labs-attachment-view-embed>
		`;
	}

	render() {
		return html`
			<d2l-labs-attachment-opener-secure
				url="${this._href}"
				target="${this._target}"
				.canOpen="${this._canOpen}"
				componentType="content"
				name="${this.attachment.name}"
			>
				${this._canOpen ? this._embedTemplate : this._iconLinkTemplate}
			</d2l-labs-attachment-opener-secure>
		`;
	}
}

window.customElements.define('d2l-labs-attachment-lti', AttachmentLti);

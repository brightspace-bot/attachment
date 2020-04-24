import './views/attachment-view-iconlink.js';
import './views/attachment-view-info.js';
import './attachment-opener-secure.js';
import { css, html, LitElement } from 'lit-element';
import { AttachmentMixin } from '../mixins/attachment-mixin.js';
import { BaseMixin } from '../mixins/base-mixin.js';
import { defaultLink } from '../helpers/attachment-utils.js';

export class AttachmentContent extends AttachmentMixin(BaseMixin(LitElement)) {
	static get properties() {
		return {
			attachment: { type: Object },
			permission: { type: Object },
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
		`;
	}

	static _findLink(attachment) {
		const link = defaultLink(attachment.url, ['https://api.brightspace.com/rels/quicklink']);
		return link && link.href.indexOf('quickLink.d2l') !== -1 && link.href.match('[?&]type=([^&#]*)')
			? link
			: null;
	}

	static getTemplate(attachment) {
		if (AttachmentContent._findLink(attachment)) {
			return 'content';
		}
		return null;
	}

	constructor() {
		super();
		this._target = '_top';
		this._componentType = 'content';
	}

	get _canOpen() {
		return this.permission.canAccess(this.attachment, this._componentType);
	}

	get _href() {
		return super.resolveHref(AttachmentContent._findLink(this.attachment).href);
	}

	get _label() {
		return this.localize(this._href.match('[?&]type=([^&#]*)')[1]);
	}

	get _name() {
		return this.attachment.name;
	}

	render() {
		return html`
			<d2l-labs-attachment-opener-secure
				url="${this._href}"
				target="${this._target}"
				.canOpen="${this._canOpen}"
				.componentType="${this._componentType}"
				name="${this._name}"
			>
				<d2l-labs-attachment-view-iconlink icon="${this._componentType}" .canOpen="${this._canOpen}">
					<d2l-labs-attachment-view-info
						.name="${this._name}"
						.href="${this._href}"
						target="${this._target}"
						.label="${this._label}"
						.canOpen="${this._canOpen}"
					>
						<slot slot="button" name="button"></slot>
					</d2l-labs-attachment-view-info>
				</d2l-labs-attachment-view-iconlink>
			</d2l-labs-attachment-opener-secure>
		`;
	}
}

window.customElements.define('d2l-labs-attachment-content', AttachmentContent);

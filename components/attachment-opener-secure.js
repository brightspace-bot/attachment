import 'd2l-tooltip/d2l-tooltip.js';
import { css, html } from 'lit-element';
import { announce } from '@brightspace-ui/core/helpers/announce.js';
import { AttachmentOpener } from './attachment-opener.js';

export class AttachmentOpenerSecure extends AttachmentOpener {
	static get properties() {
		return {
			canOpen: { type: Boolean },
			componentType: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
				outline: none;
			}
		`;
	}

	constructor() {
		super();
		this.setAttribute('tabindex', '-1');
	}

	_viewAttachment(e) {
		if (e.type === 'mouseup' && e.button !== 0) {
			return;
		}

		if (this.canOpen) {
			super._viewAttachment(e);
			return;
		}
		this.focus();
		announce(this.localize(`attachment_cannot_open_${this.componentType}`));
	}

	render() {
		return html`
			${!this.canOpen ? html`<d2l-tooltip id="tooltip" position="top">${this.localize(`attachment_cannot_open_${this.componentType}`)}</d2l-tooltip>` : null}
			<slot></slot>
		`;
	}
}

window.customElements.define('d2l-labs-attachment-opener-secure', AttachmentOpenerSecure);

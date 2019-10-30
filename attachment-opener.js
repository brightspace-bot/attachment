import { css, html, LitElement } from 'lit-element';
import { BaseMixin } from './base-mixin.js';

export class AttachmentOpener extends BaseMixin(LitElement) {
	static get properties() {
		return {
			url: { type: String },
			target: { type: String },
			isEditMode: { type: Boolean },
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
		`;
	}

	static _isAnchorEvent(e) {
		if (e.composedPath) {
			return AttachmentOpener._isAnchorTag(e.composedPath()[0]);
		}
		if (e.path) {
			return AttachmentOpener._isAnchorTag(e.path[0]);
		}
		return false;
	}

	static _isAnchorTag(element) {
		return element.nodeName === 'A';
	}

	firstUpdated() {
		this.addEventListener('mousedown', this._setYPosition);
		this.addEventListener('mouseup', this._viewAttachment);
		this.addEventListener('keydown', this._keyDown);
	}

	_setYPosition(e) {
		if (!this.isEditMode) {
			this._currentYPosition = e.clientY;
		}
	}

	_viewAttachment(e) {
		if (
			(e.type === 'mouseup' && (e.button !== 0 || e.ctrlKey)) ||
			e.target.type === 'button' ||
			AttachmentOpener._isAnchorEvent(e)
		) {
			return;
		}

		if (!this.isEditMode && (Math.abs(this._currentYPosition - e.clientY) < 5 || e.keyCode)) {
			window.open(this.url, this.target || '_blank');
		}
	}

	_keyDown(e) {
		const ENTER = 13;
		const SPACE = 32;
		if (e.keyCode === ENTER || e.keyCode === SPACE) {
			if (e.target.type !== 'button') {
				e.preventDefault();
			}
			this._viewAttachment(e);
		}
	}

	render() {
		return html`
			<slot></slot>
		`;
	}
}

window.customElements.define('d2l-labs-attachment-opener', AttachmentOpener);

import 'd2l-tooltip/d2l-tooltip.js';
import { css, html } from 'lit-element';
import { announce } from '@brightspace-ui/core/helpers/announce.js';
import { AttachmentOpener } from './attachment-opener.js';

export class AttachmentOpenerSecure extends AttachmentOpener {
	static get properties() {
		return {
			canOpen: { type: Boolean },
			componentType: { type: String },
			_showTooltip: { type: String },
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
		`;
	}

	constructor() {
		super();
		this._showTooltip = false;
	}

	get _showTooltip() {
		return this.__showTooltip;
	}

	set _showTooltip(value) {
		this.__showTooltip = value;
		if (value) {
			this._startCloseTooltipTimer(value);
		}
	}

	_closeTooltip() {
		this.showTooltip = false;
		document.removeEventListener('click', this._closeTooltip);
		this.shadowRoot.getElementById('tooltip').hide();
		this._closeTooltipHandle = null;
	}

	_startCloseTooltipTimer(showTooltip) {
		if (showTooltip) {
			clearTimeout(this._closeTooltipHandle);
			this._closeTooltipHandle = setTimeout(this._closeTooltip.bind(this), 7000);
		}
	}

	_onResize() {
		if (this.offsetParent && this._showTooltip) {
			const parentRect = this.offsetParent.getBoundingClientRect();
			this._setTooltipBoundary(parentRect);
		}
	}

	_setTooltipBoundary(parentRect) {
		this.shadowRoot.getElementById('tooltip').boundary = {
			left: 0,
			right: parentRect.width,
		};
	}

	_viewAttachment(e) {
		if (e.type === 'mouseup' && e.button !== 0) {
			return;
		}

		if (this.canOpen) {
			super._viewAttachment(e);
			return;
		}

		this._showTooltip = !this._showTooltip;

		const tooltip = this.shadowRoot.getElementById('tooltip');
		if (this._showTooltip) {
			tooltip.show();

			const parent = e.currentTarget.getBoundingClientRect();

			this._setTooltipBoundary(parent);

			if (e.keyCode) {
				tooltip.customTarget = {
					top: 0,
					left: parent.width / 2,
					right: parent.width / 2,
					height: 0,
					width: 0,
				};
			} else {
				tooltip.customTarget = {
					top: e.clientY - parent.top,
					left: e.clientX - parent.left,
					right: parent.right - e.clientX,
					height: 0,
					width: 0,
				};
			}

			setTimeout(() => document.addEventListener('click', this._closeTooltip.bind(this)), 0);
		} else {
			document.removeEventListener('click', this._closeTooltip);
			tooltip.hide();
		}
		this.requestUpdate();
		announce(this.localize(`attachment_cannot_open_${this.componentType}`));
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener('resize', this._onResize);
	}
	disconnectedCallback() {
		window.removeEventListener('resize', this._onResize);
		super.disconnectedCallback();
	}

	render() {
		return html`
			<d2l-tooltip id="tooltip" custom-target="" position="top"
				>${this.localize(`attachment_cannot_open_${this.componentType}`)}</d2l-tooltip
			>
			<slot></slot>
		`;
	}
}

window.customElements.define('d2l-labs-attachment-opener-secure', AttachmentOpenerSecure);

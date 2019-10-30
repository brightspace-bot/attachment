import { css, html, LitElement } from 'lit-element';
import { BaseMixin } from './base-mixin.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { viewStyles } from './attachment-view-styles.js';

export class AttachmentViewEmbed extends BaseMixin(LitElement) {
	static get properties() {
		return {
			src: { type: String },
			immersive: { type: Boolean },
			maxheight: { type: Number },
			_maxwidth: { type: Number },
			_left: { type: Number },
		};
	}

	static get styles() {
		return [
			viewStyles,
			css`
				:host {
					display: block;
				}

				#embed-container {
					border-top-left-radius: 6px;
					border-top-right-radius: 6px;
					position: relative;
					padding-bottom: 56.25%;
					padding-top: 0px;
					height: 0;
					overflow: hidden;
				}

				:host([immersive]) #embed-container {
					border-top-left-radius: 0;
					border-top-right-radius: 0;
				}

				#embed-container > * {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
				}

				#embedIframe {
					height: 100%;
					z-index: 1;
					background-color: #fff;
				}

				#info {
					padding: 5px 5px 12px 10px;
				}

				:host([immersive]) #info {
					display: none;
				}

				:host([dir='rtl']) #info {
					padding: 5px 10px 12px 5px;
				}

				@media (max-width: 615px), (max-device-width: 960px) {
					:host {
						width: 100%;
					}

					#info {
						padding: 5px 7px 12px 12px;
						box-sizing: border-box;
					}

					:host([dir='rtl']) #info {
						padding: 5px 12px 12px 7px;
					}
				}
			`,
		];
	}

	constructor() {
		super();
		this._left = 0;
	}

	updated(changedProperties) {
		if (changedProperties.has('maxheight')) {
			this._setMaxDimensions();
		}
	}

	_loaded(e) {
		this._pendingResolve();
		this._pendingReject = null;
		this._pendingResolve = null;

		this._setMaxDimensions(e.target);
	}

	_setMaxDimensions() {
		// For a 16:9 aspect ratio, height is 56.25% of width.
		// We are setting the max-height based on the client height, so we must set the max-width based on the ratio.
		// If this width is not 100% then we must centre the embedded iframe.
		const embedContainer = this.shadowRoot.getElementById('embed-container');
		if (this.maxheight) {
			const maxWidth = this.maxheight / 0.5625;
			this._maxwidth = maxWidth;
			if (embedContainer.clientWidth > maxWidth) {
				this._left = (embedContainer.clientWidth - maxWidth) / 2;
			}
		}
	}

	_errored(e) {
		this._pendingReject();
		this._pendingReject = null;
		this._pendingResolve = null;
		this.dispatchEvent(
			new CustomEvent('error', {
				composed: true,
				bubbles: true,
				detail: e,
			}),
		);
	}

	firstUpdated() {
		const pendingPromise = new Promise((resolve, reject) => {
			this._pendingResolve = resolve;
			this._pendingReject = reject;
		});

		const pendingEvent = new CustomEvent('d2l-pending-state', {
			composed: true,
			bubbles: true,
			detail: { promise: pendingPromise },
		});
		this.dispatchEvent(pendingEvent);
	}

	render() {
		return html`
			<div id="content">
				${this.src ? html`
					<div id="embed-container">
						<iframe
							id="embedIframe"
							src="${this.src}"
							@load="${this._loaded}"
							@error="${this._errored}"
							scrolling="no"
							frameborder="0"
							allow="autoplay"
							allowfullscreen=""
							style="max-height:${ifDefined(this.maxheight)}px; max-width: ${this._maxwidth}px; left: ${this._left}px"
						>
						</iframe>
					</div>
				` : html``}
				<div id="info">
					<slot></slot>
				</div>
			</div>
		`;
	}
}

window.customElements.define('d2l-labs-attachment-view-embed', AttachmentViewEmbed);

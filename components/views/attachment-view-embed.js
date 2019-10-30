import { css, html, LitElement } from 'lit-element';
import { BaseMixin } from '../../mixins/base-mixin.js';
import { PendingMixin } from '../../mixins/pending-mixin.js';
import { styleMap } from 'lit-html/directives/style-map.js';
import { viewStyles } from './attachment-view-styles.js';

export class AttachmentViewEmbed extends PendingMixin(BaseMixin(LitElement)) {
	static get properties() {
		return {
			src: { type: String },
			immersive: { type: Boolean },
			maxheight: { type: Number },
			_styles: { type: Object },
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
		super._loaded(e);
		this._setMaxDimensions(e.target);
	}

	_setMaxDimensions() {
		// For a 16:9 aspect ratio, height is 56.25% of width.
		// We are setting the max-height based on the client height, so we must set the max-width based on the ratio.
		// If this width is not 100% then we must centre the embedded iframe.
		if (this.maxheight) {
			const maxWidth = this.maxheight / 0.5625;
			const styles = {
				maxHeight: `${this.maxheight}px`,
				maxWidth: `${maxWidth}px`
			};
			const embedContainer = this.shadowRoot.getElementById('embed-container');
			if (embedContainer.clientWidth > maxWidth) {
				styles.left = `${(embedContainer.clientWidth - maxWidth) / 2}px`;
			}

			this._styles = styles;
		}
	}

	render() {
		return html`
			<div id="content" >
				<div id="embed-container">
					<iframe
						style="${styleMap(this._styles)}"
						id="embedIframe"
						src="${this.src}"
						@load="${this._loaded}"
						@error="${this._errored}"
						scrolling="no"
						frameborder="0"
						allow="autoplay"
						allowfullscreen=""
					>
					</iframe>
				</div>
				<div id="info">
					<slot></slot>
				</div>
			</div>
		`;
	}
}

window.customElements.define('d2l-labs-attachment-view-embed', AttachmentViewEmbed);

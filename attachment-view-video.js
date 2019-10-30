import { css, html, LitElement } from 'lit-element';
import { BaseMixin } from './base-mixin.js';
import { PendingMixin } from './pending-mixin.js';
import { styleMap } from 'lit-html/directives/style-map.js';
import { viewStyles } from './attachment-view-styles.js';

export class AttachmentViewVideo extends PendingMixin(BaseMixin(LitElement)) {
	static get properties() {
		return {
			url: { type: String },
			src: { type: String },
			thumbnailUrl: {type: String },
			_style: {type: Object },
			_thumbnailImageLoaded: { type: Boolean }
		};
	}

	static get styles() {
		return [
			viewStyles,
			css`
			:host {
				display: block;
			}

			#video-container {
				border-top-left-radius: 6px;
				border-top-right-radius: 6px;
				position: relative;
				padding-bottom: 56.25%;
				padding-top: 0px;
				height: 0;
				overflow: hidden;
			}

			#video-container > * {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
			}

			.thumbnail-wrapper {
				z-index: 1;
				cursor: pointer;
			}

			.thumbnail-wrapper button {
				border: 0;
				padding: 0;
				cursor: pointer;
			}

			.thumbnail-wrapper .thumbnail-play {
				position: absolute;
				top: 27%;
				left: 30%;
				width: 40%;
				height: 35%;
				background-color: rgb(50,50,50); /* fallback for rgba */
				background-color: rgba(0, 0, 0, 0.7);
				padding: 3% 0;
				border-radius: 8px;
			}

			.thumbnail-wrapper #video-thumbnail {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
			}

			.big-screen {
				display: block;
			}

			.small-screen {
				display: none;
			}

			#info {
				padding: 5px 5px 12px 10px;
			}

			:host([dir='rtl']) #info {
				padding: 5px 10px 12px 5px;
			}

			@media (max-width: 615px), (max-device-width: 960px) {
				:host {
					width: 100%;
				}

				.big-screen {
					display: none;
				}
				.small-screen {
					display: block;
				}

				#info {
					padding: 5px 7px 12px 12px;
					box-sizing: border-box;
				}

				:host([dir='rtl']) #info {
					padding: 5px 12px 12px 7px;
				}
			}
		`];
	}

	constructor() {
		super();
		this._thumbnailImageLoaded = false;
	}

	_loaded(e) {
		super._loaded(e);
		if (this.src) {
			// If video is not 16x9, this will cover any blank space in the iFrame with black
			this._style = {
				backgroundColor: '#000'
			};
		}
	}

	_onThumbnailLoaded() {
		this._thumbnailImageLoaded = true;
	}

	_onThumbnailTap() {
		window.open(this.url, '_blank');
	}

	render() {
		return html`
			<div id="content">
				<div id="video-container">
					<div class="small-screen thumbnail-wrapper" ?hidden="${!this._thumbnailImageLoaded}" @click="${this._onThumbnailTap}">
						<button>
							<img id="video-thumbnail" @load="${this._onThumbnailLoaded}" src="${this.thumbnailUrl}"
								aria-label="${this.localize('aria_video_thumbnail')}"
								alt="${this.localize('video_thumbnail')}">
							<div>
								<img class="thumbnail-play" ?hidden="${!this._thumbnailImageLoaded}" src="${this.constructor.resolveUrl('icons/thumbnail-play.svg')}">
							</div>
						</button>
					</div>
					<iframe class="big-screen" src="${this.src}"
						@load="${this._loaded}"
						@error="${this._errored}"
						frameborder="0" gesture="media" allowfullscreen=""
						aria-label="${this.localize('video_player')}"
						style="${styleMap(this._style)}">
					</iframe>
				</div>
				<div id="info">
					<slot></slot>
				</div>
			</div>
		`;
	}
}

window.customElements.define('d2l-labs-attachment-view-video', AttachmentViewVideo);

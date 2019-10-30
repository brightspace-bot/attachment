import { css, html, LitElement } from 'lit-element';
import { BaseMixin } from './base-mixin.js';
import { viewStyles } from './attachment-view-styles.js';

export class AttachmentViewImageLink extends BaseMixin(LitElement) {
	static get properties() {
		return {
			src: { type: String },
		};
	}

	static get styles() {
		return [
			viewStyles,
			css`
				:host {
					display: block;
				}

				#content {
					display: flex;
					flex-direction: row;
					align-items: center;
					width: 100%;
					box-sizing: border-box;
				}

				img {
					display: block;
					height: 156px;
					width: 274px; /* TODO - why 274px */
					object-fit: cover;
					border-radius: 5px 0 0 5px;
					margin-right: 10px;
				}

				:host([dir='rtl']) img {
					margin-right: 0;
					margin-left: 10px;
					border-radius: 0 5px 5px 0;
				}

				#info {
					padding: 14px 5px 14px 10px;
					flex: 1;
				}

				:host([dir='rtl']) #info {
					padding: 14px 10px 14px 5px;
				}

				@media (max-width: 615px), (max-device-width: 960px) {
					:host {
						width: 100%;
					}

					#content {
						flex-direction: column;
					}

					img {
						width: 100%;
						height: 144px;
						margin: 0;
						border-radius: 5px 5px 0 0;
					}

					:host([dir='rtl']) img {
						margin: 0;
						border-radius: 5px 5px 0 0;
					}

					#info {
						padding: 7px 7px 7px 12px;
						box-sizing: border-box;
					}

					:host([dir='rtl']) #info {
						padding: 7px 12px 7px 7px;
					}
				}
			`,
		];
	}

	_loaded() {
		this._pendingResolve();
		this._pendingReject = null;
		this._pendingResolve = null;
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
					<img
						src="${this.src}"
						@error="${this._errored}"
						@load="${this._loaded}"
						alt="${this.localize('link_thumbnail')}"
					/>
				` : html``}
				<div id="info">
					<slot></slot>
				</div>
			</div>
		`;
	}
}

window.customElements.define('d2l-labs-attachment-view-imagelink', AttachmentViewImageLink);

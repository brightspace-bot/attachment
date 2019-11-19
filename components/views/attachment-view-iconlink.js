import '@brightspace-ui/core/components/colors/colors.js';
import '@polymer/iron-icon/iron-icon.js';
import '../../icons/cs-30-icons.js';
import '../../icons/cs-60-icons.js';
import { css, html, LitElement } from 'lit-element';
import { BaseMixin } from '../../mixins/base-mixin.js';
import { PendingMixin } from '../../mixins/pending-mixin.js';
import { viewStyles } from './attachment-view-styles.js';

export class AttachmentViewIconLink extends PendingMixin(BaseMixin(LitElement)) {
	static get properties() {
		return {
			icon: { type: String },
			src: { type: String },
			canOpen: {
				type: Boolean,
				reflect: true,
				attribute: 'can-open',
			},
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
					padding: 14px 5px 14px 10px;
					box-sizing: border-box;
				}

				:host([dir='rtl']) #content {
					padding: 14px 10px 14px	5px;
				}

				.big-screen {
					display: block;
				}

				.small-screen {
					display: none;
				}

				#content > iron-icon {
					padding-right: 10px;
				}

				:host([dir='rtl']) #content > iron-icon {
					padding-right: 0px;
					padding-left: 10px;
				}

				iron-icon {
					flex: 0 0 auto;
				}

				iron-icon.big-screen {
					height: 60px;
					width: 60px;
				}

				iron-icon.small-screen {
					height: 30px;
					width: 30px;
				}

				.attachment-icon {
					color: var(--d2l-color-ferrite);
				}

				:host([can-open]) .attachment-icon {
					color: var(--d2l-color-celestine);
				}

				@media (max-width: 615px), (max-device-width: 960px) {
					.big-screen {
						display: none;
					}

					.small-screen {
						display: block;
					}
				}

				.favicon-wrapper {
					padding-right: 12px;
					align-self: normal;
				}

				:host([dir='rtl']) .favicon-wrapper {
					padding-right: 0;
					padding-left: 12px;
				}

				.favicon-wrapper img {
					width: 30px;
					height: 30px;
				}
			`,
		];
	}

	constructor() {
		super();
		this.canOpen = true;
	}

	_errored(e) {
		this._favIconError = true;
		this.requestUpdate();
		super._errored(e);
	}

	get _showFavIcon() {
		return this.src && !this._favIconError;
	}

	get _iconTemplate() {
		return html`
			<iron-icon class="small-screen attachment-icon" .icon="d2l-cs-30:${this.icon}"></iron-icon>
			<iron-icon class="big-screen attachment-icon" .icon="d2l-cs-60:${this.icon}"></iron-icon>
		`;
	}

	get _favIconTemplate() {
		return html`
			<div class="favicon-wrapper">
				<img
					src="${this.src}"
					@error="${this._errored}"
					@load="${this._loaded}"
					alt="${this.localize('link_thumbnail')}"
				/>
			</div>
		`;
	}

	firstUpdated(changedProperties) {
		let pendingPromise;
		if (changedProperties.has('src')) {
			pendingPromise = super._createPendingPromise();
		} else if (changedProperties.has('icon')) {
			pendingPromise = Promise.resolve();
		}

		if (pendingPromise) {
			super._dispatchPending(pendingPromise);
		}
	}

	render() {
		return html`
			<div id="content">
				${this._showFavIcon ? this._favIconTemplate : this._iconTemplate}
				<slot></slot>
			</div>
		`;
	}
}

window.customElements.define('d2l-labs-attachment-view-iconlink', AttachmentViewIconLink);

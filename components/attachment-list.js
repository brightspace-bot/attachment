import '@brightspace-ui/core/components/colors/colors.js';
import 'd2l-alert/d2l-alert.js';
import { css, html, LitElement } from 'lit-element';
import { BaseMixin } from '../mixins/base-mixin.js';
import { labelStyles } from '@brightspace-ui/core/components/typography/styles.js';

export class AttachmentList extends BaseMixin(LitElement) {
	static get properties() {
		return {
			editing: { type: Boolean },
			_hasAttachments: { type: Boolean },
			_hasUntrustedAttachment: { type: Boolean }
		};
	}

	static get styles() {
		return [
			labelStyles,
			css`
				ul ::slotted(li:not(:last-of-type)) {
					margin-bottom: 20px;
				}

				ul {
					list-style-type: none;
					padding: 0;
					margin: 0;
					width: 100%;
				}

				.attachment-list-wrapper {
					margin-top: 20px;
					display: block;
				}

				#attachment-list-title {
					margin-bottom: 8px;
				}

				#untrusted-website-warning {
					margin-bottom: 20px;
				}

				@media (max-width: 615px), (max-device-width: 960px) {
					.attachment-list-wrapper {
						margin-top: 10px;
					}
				}
			`,
		];
	}

	get _showTitle() {
		return this.editing && this._hasAttachments;
	}

	_untrustedAttachment(e) {
		this._hasUntrustedAttachment = e.target.creating;
	}

	_dismissUntrusted() {
		this._hasUntrustedAttachment = false;
	}

	get _showUntrusted() {
		return this.editing && this._hasUntrustedAttachment;
	}

	render() {
		return html`
			<div class="d2l-typography attachment-list-wrapper">
				${this._showTitle ? html`
					<div id="attachment-list-title" class="d2l-label-text">${this.localize('attachments')}
					</div>
				` : html``}

				${this._showUntrusted ? html`
					<d2l-alert id="untrusted-website-warning"
						type="warning"
						subtext="${this.localize('unstrusted_website_subtext')}"
						has-close-button>${this.localize('unstrusted_website')}
					</d2l-alert>
				` : html``}

				<ul role="contentinfo" aria-label="${this.localize('attachments')}">
					<slot id="attachments" name="attachment"></slot>
				</ul>
			</div>
		`;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.addEventListener('d2l-attachment-untrusted', this._untrustedAttachment);
		this.addEventListener('d2l-alert-closed', this._dismissUntrusted);

		const slot = this.shadowRoot.getElementById('attachments');
		slot.addEventListener('slotchange', () =>
			this._hasAttachments = slot.assignedNodes().length > 0
		);
	}
}

window.customElements.define('d2l-labs-attachment-list', AttachmentList);

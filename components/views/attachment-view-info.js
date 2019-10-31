import '@brightspace-ui/core/components/colors/colors.js';
import {
	bodyCompactStyles,
	bodySmallStyles,
	bodyStandardStyles,
} from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined.js';

import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';

export class AttachmentViewInfo extends RtlMixin(LitElement) {
	static get properties() {
		return {
			name: { type: String },
			href: { type: String },
			target: { type: String },
			label: { type: String },
			description: { type: String },
			canOpen: {
				type: Boolean,
				reflect: true,
				attribute: 'can-open',
			},
		};
	}

	static get styles() {
		return [
			bodyStandardStyles,
			bodySmallStyles,
			bodyCompactStyles,
			css`
				:host {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					width: 100%;
					box-sizing: border-box;
				}

				.info {
					display: flex;
					flex-direction: column;
					word-wrap: break-word;
					word-break: break-word;
					flex: 1;
					min-width: 0; /* Required for FF and Edge */
					padding-right: 10px;
				}

				:host([dir='rtl']) .info {
					padding-right: 0;
					padding-left: 10px;
				}

				.info > div,
				.info > span {
					margin-top: -7px;
				}

				.description {
					padding-top: 10px;
				}

				.description span,
				.attachment-name {
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}

				a {
					text-decoration: none;
					cursor: pointer;
				}

				a:hover,
				a:focus {
					text-decoration: underline;
					color: #1c5295;
					outline: none;
					outline-style: none;
				}

				.attachment-name {
					color: var(--d2l-color-ferrite);
				}

				:host([can-open]) .attachment-name {
					color: var(--d2l-color-celestine);
				}
			`,
		];
	}

	constructor() {
		super();
		this.canOpen = true;
	}

	focus() {
		// This doesn't seem to work reliably on some kinds of attachments. e.g. LTI.
		// I tried various combinations of await this.updateComplete and setTimeout.
		// It seems like when the LTI iframe loads, it grabs focus which didn't seem
		// to happen in the old Polymer implementation.
		const nameLink = this.shadowRoot.getElementById('name');
		if (nameLink) {
			nameLink.focus();
		}
	}

	render() {
		const href = this.canOpen ? this.href : undefined;
		return html`
			<div class="info">
				<a
					id="name"
					href="${ifDefined(href)}"
					target="${this.target}"
					class="d2l-body-standard attachment-name"
					>${this.name}
				</a>
				${this.label ? html`
					<div class="labels">
						<span class="d2l-body-small">${this.label}</span>
					</div>
				` : html``}
				${this.description ? html`
					<div class="description">
						<span class="d2l-body-compact">${this.description}</span>
					</div>
				` : html``}
			</div>
			<slot name="button"></slot>
		`;
	}
}

window.customElements.define('d2l-labs-attachment-view-info', AttachmentViewInfo);

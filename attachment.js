import '@brightspace-ui/core/components/button/button-icon.js';
import './attachment-embed.js';
import './attachment-url.js';
import './attachment-video.js';
import { css, html, LitElement } from 'lit-element';
import { defaultLink, normalizeAttachmentUrl, unfurl } from './attachment-utils.js';
import { AttachmentContent } from './attachment-content.js';
import { AttachmentFile } from './attachment-file.js';
import { AttachmentImage } from './attachment-image.js';
import { AttachmentLti } from './attachment-lti.js';
import { BaseMixin } from './base-mixin.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { PendingContainerMixin } from 'siren-sdk/src/mixin/pending-container-mixin.js';
import { RequestProviderMixin } from './request-provider-mixin.js';

export class Attachment extends RequestProviderMixin(PendingContainerMixin(BaseMixin(LitElement))) {
	static get properties() {
		return {
			attachment: { type: Object },
			isEditMode: { type: Boolean },
			immersive: { type: Boolean },
			permission: { type: Object },
			isDeleted: {type: Boolean }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}

			div.display {
				cursor: pointer;
			}

			img {
				/* width: 100%; */
				height: 156px;
				display: block;
			}

			@media (max-width: 615px), (max-device-width: 960px) {
				img {
					width: 100%;
					height: 144px;
				}
			}
		`;
	}

	static _getSimpleTemplate(attachment) {
		let template;
		template = AttachmentFile.getTemplate(attachment);
		template = template || AttachmentLti.getTemplate(attachment);
		template = template || AttachmentContent.getTemplate(attachment);
		template = template || AttachmentImage.getTemplate(attachment);
		return template;
	}

	static _getUnfurledTemplate(type) {
		switch (type) {
			case 'Video':
				return 'video';
			case 'Embed':
				return 'embed';
			default:
				return 'url';
		}
	}

	constructor() {
		super();
		this._hasPendingChildren = true;
	}

	get attachment() {
		return this._attachment;
	}

	set attachment(value) {
		if (value === this._attachment) {
			return;
		}

		this._attachment = value;

		// This copy is required because we have still not standardized how
		// we are passing in the url property which should be an array of urls.
		// In some cases we are still passing the array in the urls property
		// which is incorrect
		this.__attachment = { ...value, url: normalizeAttachmentUrl(value) };

		this._template = Attachment._getSimpleTemplate(this.__attachment);
		if (this._template === null) {
			this._unfurl(this.__attachment);
		} else {
			this.requestUpdate();
		}
	}

	async _callUnfurl(attachment) {
		let unfurlApiEndpoint = this.requestProvider('d2l-provider-unfurl-api-endpoint');
		if (!unfurlApiEndpoint) {
			unfurlApiEndpoint = () => '';
		}

		let checkTrustedSiteFn = this.requestProvider('d2l-provider-trusted-site-fn');
		if (!checkTrustedSiteFn) {
			checkTrustedSiteFn = () => () => false;
		}

		const result = await unfurl(unfurlApiEndpoint(), checkTrustedSiteFn(), attachment);
		return result;
	}

	async _unfurl(attachment) {
		try {
			this._unfurlResult = await this._callUnfurl(attachment);
			if (!this._unfurlResult) {
				this._unfurlResult = {
					url: defaultLink(attachment.url).href,
				};
			}
			this._template = Attachment._getUnfurledTemplate(this._unfurlResult.type);
			// TODO - notify name updated
			// this._name = attachment.name || unfurled.title || unfurled.url;
		} finally {
			this.requestUpdate();
		}
	}

	_removeAttachment() {
		const removeEvent = new CustomEvent('d2l-attachment-removed', {
			composed: true,
			bubbles: true,
			detail: this.attachment.id,
		});
		this.dispatchEvent(removeEvent);

		// TODO - add back announce
		// this._announce('aria_removed_attachment', 'attachment_name', this.attachment.name);
	}

	_immersiveAttachment() {
		const immersiveEvent = new CustomEvent('d2l-attachment-immersive', {
			composed: true,
			bubbles: true,
			detail: this.attachment,
		});
		this.dispatchEvent(immersiveEvent);
	}

	get _attachmentTemplate() {
		return this[`_${this._template}Template`];
	}

	get _fileTemplate() {
		return html`
			<d2l-labs-attachment-file
				id="attachment"
				.attachment="${this.__attachment}"
				.isEditMode="${this.isEditMode}"
				.permission="${this.permission}"
			>
				${this._removeButtonTemplate}
			</d2l-labs-attachment-file>
		`;
	}

	get _ltiTemplate() {
		return html`
			<d2l-labs-attachment-lti
				id="attachment"
				.attachment="${this.__attachment}"
				.isEditMode="${this.isEditMode}"
				.permission="${this.permission}"
				?immersive="${this.immersive}"
			>
				${this._removeButtonTemplate}
				${this._immersiveButtonTemplate}
			</d2l-labs-attachment-lti>
		`;
	}

	get _contentTemplate() {
		return html`
			<d2l-labs-attachment-content
				id="attachment"
				.attachment="${this.__attachment}"
				.isEditMode="${this.isEditMode}"
				.permission="${this.permission}"
			>
				${this._removeButtonTemplate}
			</d2l-labs-attachment-content>
		`;
	}

	get _imageTemplate() {
		return html`
			<d2l-labs-attachment-image
				id="attachment"
				.attachment="${this.__attachment}"
				.isEditMode="${this.isEditMode}"
				.permission="${this.permission}"
			>
				${this._removeButtonTemplate}
			</d2l-labs-attachment-image>
		`;
	}

	get _videoTemplate() {
		return html`
			<d2l-labs-attachment-video
				id="attachment"
				.attachment="${this.__attachment}"
				.isEditMode="${this.isEditMode}"
				.unfurlResult="${this._unfurlResult}"
				.permission="${this.permission}"
			>
				${this._removeButtonTemplate}
			</d2l-labs-attachment-video>
		`;
	}

	get _embedTemplate() {
		return html`
			<d2l-labs-attachment-embed
				id="attachment"
				.attachment="${this.__attachment}"
				.isEditMode="${this.isEditMode}"
				.unfurlResult="${this._unfurlResult}"
				.permission="${this.permission}"
				?immersive="${this.immersive}"
			>
				${this._removeButtonTemplate}
				${this._immersiveButtonTemplate}
			</d2l-labs-attachment-embed>
		`;
	}

	get _urlTemplate() {
		return html`
			<d2l-labs-attachment-url
				id="attachment"
				.attachment="${this.attachment}"
				.isEditMode="${this.isEditMode}"
				.unfurlResult="${this._unfurlResult}"
				.permission="${this.permission}"
			>
				${this._removeButtonTemplate}
			</d2l-labs-attachment-url>
		`;
	}

	get _removeButtonTemplate() {
		return this.isEditMode ? html`
				<d2l-button-icon
					slot="button"
					icon="tier1:close-small"
					text="${this.localize('aria_remove_attachment', 'attachment_name', this.attachment.name)}"
					@click="${this._removeAttachment}"
				></d2l-button-icon>
			` : html``;
	}

	get _immersiveButtonTemplate() {
		return !this.isEditMode	? html`
			<d2l-button-icon
				slot="button"
				icon="tier1:fullscreen"
				text="${this.localize('open_in_fullscreen')}"
				@click="${this._immersiveAttachment}"
			></d2l-button-icon>
		` : html``;
	}

	get _deletedTemplate() {
		return html`
			<d2l-labs-attachment-view-deleted
				.attachment="${this.attachment}"
			>
			</d2l-labs-attachment-view-deleted>
		`;
	}

	get _skeletonTemplate() {
		return html`
			${this._hasPendingChildren ? html`
				<img
					src="${this.constructor.resolveUrl('icons/link-skeleton.svg')}"
					alt="${this.localize('link_thumbnail')}"
				/>
			` : html``}
		`;
	}

	get _standardTemplate() {
		return html`
			${this._skeletonTemplate}
			<div class="${classMap({ display: !this.isEditMode })}" ?hidden="${this._hasPendingChildren}">
				${this._attachmentTemplate}
			</div>
		`;
	}

	render() {
		return html`
			${this.isDeleted ? this._deletedTemplate : this._standardTemplate}
		`;
	}

	updated(changedProperties) {
		if (changedProperties.has('isDeleted') && this.isDeleted === false) {
			const attachment = this.shadowRoot.getElementById('attachment');
			if (attachment) {
				attachment.focus();
			}
		}
	}
}

window.customElements.define('d2l-labs-attachment', Attachment);

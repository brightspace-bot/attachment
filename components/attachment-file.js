import './attachment-opener-secure.js';
import './views/attachment-view-info.js';
import { css, html, LitElement } from 'lit-element';
import { defaultLink, detectImage, hasExtension, imageExtensions } from '../helpers/attachment-utils.js';
import { AttachmentMixin } from '../mixins/attachment-mixin.js';
import { BaseMixin } from '../mixins/base-mixin.js';

export class AttachmentFile extends AttachmentMixin(BaseMixin(LitElement)) {
	static get properties() {
		return {
			attachment: { type: Object },
			permission: { type: Object },
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
		`;
	}

	static _findCourseFile(attachment, extensions) {
		const link = defaultLink(attachment.url, ['https://api.brightspace.com/rels/quicklink']);
		const quickLinkType = link.href.match('[?&]type=([^&#]*)');
		const isQuickLink = link.href.indexOf('quickLink.d2l') !== -1 && quickLinkType;
		const isCourseFile = isQuickLink && quickLinkType[1] === 'coursefile';
		if (!isCourseFile) {
			return null;
		}

		if (link && extensions) {
			if (hasExtension(link.href.match('[?&]fileId=([^&#]*)')[1], extensions)) {
				return link;
			}
			return null;
		}
		return link;
	}

	static _findDocument(attachment, extensions) {
		if (attachment.type !== 'Document') {
			return null;
		}
		const link = defaultLink(attachment.url);
		if (link && extensions) {
			if (hasExtension(link.hef, extensions)) {
				return link;
			}
			if (hasExtension(attachment.name, extensions)) {
				return link;
			}
			return null;
		}
		return link;
	}

	static _findLink(attachment, extensions) {
		const link = AttachmentFile._findDocument(attachment, extensions);
		if (link) {
			return link;
		}
		return AttachmentFile._findCourseFile(attachment, extensions);
	}

	static getTemplate(attachment) {
		if (AttachmentFile._findLink(attachment)) {
			return 'file';
		}
		return null;
	}

	constructor() {
		super();
		this._componentType = 'file';
		this._target = '_blank';
	}

	get _src() {
		return super.resolveHref(this.__src);
	}

	set _src(value) {
		this.__src = value;
	}

	get attachment() {
		return this._attachment;
	}

	set attachment(value) {
		this._attachment = value;
		let image = detectImage(this._attachment);
		if (image) {
			this._src = image.url;
			return;
		}
		image = AttachmentFile._findLink(this._attachment, imageExtensions);
		if (image) {
			this._src = image.href;
		}
	}

	get _href() {
		return super.resolveHref(AttachmentFile._findLink(this.attachment).href);
	}

	get _label() {
		if (this.attachment.name) {
			const extensionIndex = this.attachment.name.lastIndexOf('.');
			return extensionIndex > 0
				? this.attachment.name
					.substring(extensionIndex + 1, this.attachment.name.length)
					.toUpperCase()
				: '';
		}
		return '';
	}

	get _name() {
		if (this.attachment.name) {
			return (
				this.attachment.name.substr(0, this.attachment.name.lastIndexOf('.')) ||
				this.attachment.name
			);
		}
		return '';
	}

	get _canOpen() {
		return this.permission.canAccess(this.attachment, this._componentType);
	}

	get _imageTemplate() {
		return html`
			<d2l-labs-attachment-view-image src="${this._src}" .name="${this._name}">
				<slot name="button" slot="button"></slot>
			</d2l-labs-attachment-view-image>
		`;
	}

	get _documentTemplate() {
		return html`
			<d2l-labs-attachment-opener-secure
				url="${this._href}"
				target="${this._target}"
				.canOpen="${this._canOpen}"
				.componentType="${this._componentType}"
				name="${this._name}"
			>
				<d2l-labs-attachment-view-iconlink icon="${this._componentType}" .canOpen="${this._canOpen}">
					<d2l-labs-attachment-view-info
						.name="${this._name}"
						.href="${this._href}"
						target="${this._target}"
						.label="${this._label}"
						.canOpen="${this._canOpen}"
					>
						<slot name="button" slot="button"></slot>
					</d2l-labs-attachment-view-info>
				</d2l-labs-attachment-view-iconlink>
			</d2l-labs-attachment-opener-secure>
		`;
	}

	get _type() {
		return this._canOpen && this._src ? 'Image' : 'Document';
	}

	get _template() {
		switch (this._type) {
			case 'Image':
				return this._imageTemplate;
			case 'Document':
			default:
				return this._documentTemplate;
		}
	}

	render() {
		return html`
			${this._template}
		`;
	}
}

window.customElements.define('d2l-labs-attachment-file', AttachmentFile);

import { html, storiesOf, withClassPropertiesKnobs, withKnobs } from '@open-wc/demoing-storybook';
import { Attachment } from '../attachment.js';

export const document = {
	id: '1',
	name: 'fileUploadNonImage.txt',
	type: 'Document',
	url: 'http://hostname/content/course1/fileUploadNonImage.txt',
};

export const documentImage = {
	id: '1',
	type: 'Document',
	name: 'TalkingtoourChildren.jpg',
	url: 'https://ichef.bbci.co.uk/wwfeatures/live/624_351/images/live/p0/7p/sr/p07psr8q.jpg',
};

export const courseFile = {
	id: '1',
	name: 'WhistlerGranFondo2018-FinisherCert.pdf',
	url:
		'http://hostname/d2l/common/dialogs/quickLink/quickLink.d2l?ou=123065&type=coursefile&fileId=WhistlerGranFondo2018-FinisherCert.pdf',
};

export const courseFileImage = {
	id: '1',
	name: 'Talking to our Children',
	url:
		'https://ichef.bbci.co.uk/wwfeatures/live/624_351/images/live/p0/7p/sr/p07psr8q.jpg?quickLink.d2l&ou=123065&type=coursefile&fileId=p07psr8q.jpg',
};

const hasPermission = {
	canAccess: (_, type) => type === 'file',
};

const noPermission = {
	canAccess: () => false,
};

storiesOf('Attachments|attachment-file', module)
	.addDecorator(withKnobs)
	.add(
		'document',
		() =>
			withClassPropertiesKnobs(Attachment, {
				template: html`
					<d2l-labs-attachment .attachment=${document} .permission="${hasPermission}"></d2l-labs-attachment>
				`,
			}),
		{
			knobs: {
				escapeHTML: false,
			},
		},
	)
	.add(
		'no open document',
		() =>
			withClassPropertiesKnobs(Attachment, {
				template: html`
					<d2l-labs-attachment .attachment=${document} .permission="${noPermission}"></d2l-labs-attachment>
				`,
			}),
		{
			knobs: {
				escapeHTML: false,
			},
		},
	)
	.add(
		'course file',
		() =>
			withClassPropertiesKnobs(Attachment, {
				template: html`
					<d2l-labs-attachment .attachment=${courseFile} .permission="${hasPermission}"></d2l-labs-attachment>
				`,
			}),
		{
			knobs: {
				escapeHTML: false,
			},
		},
	)
	.add(
		'document image',
		() =>
			withClassPropertiesKnobs(Attachment, {
				template: html`
					<d2l-labs-attachment
						.attachment=${documentImage}
						.permission="${hasPermission}"
					></d2l-labs-attachment>
				`,
			}),
		{
			knobs: {
				escapeHTML: false,
			},
		},
	)
	.add(
		'no open document image',
		() =>
			withClassPropertiesKnobs(Attachment, {
				template: html`
					<d2l-labs-attachment
						.attachment=${documentImage}
						.permission="${noPermission}"
					></d2l-labs-attachment>
				`,
			}),
		{
			knobs: {
				escapeHTML: false,
			},
		},
	)
	.add(
		'course file image',
		() =>
			withClassPropertiesKnobs(Attachment, {
				template: html`
					<d2l-labs-attachment
						.attachment=${courseFileImage}
						.permission="${hasPermission}"
					></d2l-labs-attachment>
				`,
			}),
		{
			knobs: {
				escapeHTML: false,
			},
		},
	);

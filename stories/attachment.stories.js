import { action, decorate } from '@storybook/addon-actions';
import { html, storiesOf, withClassPropertiesKnobs, withKnobs } from '@open-wc/demoing-storybook';
import { Attachment } from '../components/attachment.js';

const editableAttachment = {
	id: '1',
	name: 'Attachment 4',
	url:
		'http://localhost/d2l/common/dialogs/quickLink/quickLink.d2l?ou=123061&type=dropbox&rcode=6CF2AEF1-C439-4177-8784-6EAAC5432652-324',
};

export const immersiveAttachment = {
	id: '1',
	name: 'Saltire LTI Tool',
	url:
		'https://lti.tools/saltire/tp/quickLink/quickLink.d2l?ou=123065&type=lti&rcode=AEAD0C19-C6E9-4E27-993D-CE2FABBDBA9C-61&srcou=123065',
};

const TRUE = true;

const hasPermission = {
	canAccess: () => true,
};

const pickDetail = decorate([args => args[0].detail]);

const attachmentRemoved = e => {
	e.target.isDeleted = true;
};

const attachmentRestored = e => {
	e.target.isDeleted = false;
};

const attachmentImmersive = e => {
	action('d2l-attachment-immersive')(e.detail);
	e.target.immersive = true;
};

storiesOf('Attachments|attachment', module)
	.addDecorator(withKnobs)
	.addDecorator(pickDetail.withActions('d2l-attachment-removed', 'd2l-attachment-restored'))
	.add(
		'editable',
		() =>
			withClassPropertiesKnobs(Attachment, {
				template: html`
					<d2l-labs-attachment
						?isEditMode="${TRUE}"
						.attachment="${editableAttachment}"
						.permission="${hasPermission}"
						@d2l-attachment-removed="${attachmentRemoved}"
						@d2l-attachment-restored="${attachmentRestored}"
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
		'immersive',
		() =>
			withClassPropertiesKnobs(Attachment, {
				template: html`
					<d2l-labs-attachment
						.attachment="${immersiveAttachment}"
						.permission="${hasPermission}"
						@d2l-attachment-immersive="${attachmentImmersive}"
					></d2l-labs-attachment>
				`,
			}),
		{
			knobs: {
				escapeHTML: false,
			},
		},
	);

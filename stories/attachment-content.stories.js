import { html, storiesOf, withClassPropertiesKnobs, withKnobs } from '@open-wc/demoing-storybook';
import { Attachment } from '../components/attachment.js';
import { decorate } from '@storybook/addon-actions';

const dropbox = {
	id: '1',
	name: 'Homework',
	url:
		'http://localhost/d2l/common/dialogs/quickLink/quickLink.d2l?ou=123061&type=dropbox&rcode=6CF2AEF1-C439-4177-8784-6EAAC5432652-324',
};

const quiz = {
	id: '1',
	name: 'Mid Term',
	url:
		'http://localhost/d2l/common/dialogs/quickLink/quickLink.d2l?ou=123061&type=quiz&rcode=6CF2AEF1-C439-4177-8784-6EAAC5432652-324',
};

const hasPermission = {
	canAccess: (_, type) => type === 'content',
};

const noPermission = {
	canAccess: () => false,
};

const pickDetail = decorate([args => args[0].detail]);

storiesOf('Attachments|attachment-content', module)
	.addDecorator(withKnobs)
	.addDecorator(pickDetail.withActions('d2l-attachment-removed'))
	.add(
		'default',
		() =>
			withClassPropertiesKnobs(Attachment, {
				template: html`
					<d2l-labs-attachment
						.attachment="${dropbox}"
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
		'no open',
		() =>
			withClassPropertiesKnobs(Attachment, {
				template: html`
					<d2l-labs-attachment
						.attachment="${quiz}"
						.permission="${noPermission}"
					></d2l-labs-attachment>
				`,
			}),
		{
			knobs: {
				escapeHTML: false,
			},
		},
	);

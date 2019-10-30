import { html, storiesOf, withClassPropertiesKnobs, withKnobs } from '@open-wc/demoing-storybook';
import { Attachment } from '../components/attachment.js';

export const attachment = {
	id: '1',
	name: 'Saltire LTI Tool',
	url:
		'https://lti.tools/saltire/tp/quickLink/quickLink.d2l?ou=123065&type=lti&rcode=AEAD0C19-C6E9-4E27-993D-CE2FABBDBA9C-61&srcou=123065',
};

const hasPermission = {
	canAccess: (_, type) => type === 'lti',
};

const noPermission = {
	canAccess: () => false,
};

storiesOf('Attachments|attachment-lti', module)
	.addDecorator(withKnobs)
	.add(
		'default',
		() =>
			withClassPropertiesKnobs(Attachment, {
				template: html`
					<d2l-labs-attachment .attachment=${attachment} .permission="${hasPermission}"></d2l-labs-attachment>
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
					<d2l-labs-attachment .attachment=${attachment} .permission="${noPermission}"></d2l-labs-attachment>
				`,
			}),
		{
			knobs: {
				escapeHTML: false,
			},
		},
	);

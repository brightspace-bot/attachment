import 'd2l-fetch/d2l-fetch.js';
import { html, storiesOf, withClassPropertiesKnobs, withKnobs } from '@open-wc/demoing-storybook';
import { Attachment } from '../attachment.js';

const attachmentWithImage = {
	id: '1',
	url:
		'https://rouleur.cc/editorial/wp-content/uploads/2018/08/OFS_Eddy_Merckx_1971_03-e1535647669212.jpg',
	name: 'Duel, Orcières- Merlette, Tour de France, 8 July 1971',
};

const attachmentWithInvalidImage = {
	id: '1',
	url: 'https://nowhere.com/e1535647669212.jpg',
	name: 'Duel, Orcières- Merlette, Tour de France, 8 July 1971',
};

storiesOf('Attachments|attachment-image', module)
	.addDecorator(withKnobs)
	.add(
		'image',
		() =>
			withClassPropertiesKnobs(Attachment, {
				template: html`
					<d2l-labs-attachment .attachment=${attachmentWithImage}></d2l-labs-attachment>
				`,
			}),
		{
			knobs: {
				escapeHTML: false,
			},
		},
	)
	.add(
		'image error',
		() =>
			withClassPropertiesKnobs(Attachment, {
				template: html`
					<d2l-labs-attachment .attachment=${attachmentWithInvalidImage}></d2l-labs-attachment>
				`,
			}),
		{
			knobs: {
				escapeHTML: false,
			},
		},
	);

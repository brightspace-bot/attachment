import { html, storiesOf, withClassPropertiesKnobs, withKnobs } from '@open-wc/demoing-storybook';

import { AttachmentViewEmbed } from '../attachment-view-embed.js';

const embedUrl = 'https://quizlet.com/286716956/match/embed?x=1jj1';

storiesOf('Views|attachment-view-embed', module)
	.addDecorator(withKnobs)
	.add('default', () =>
		withClassPropertiesKnobs(AttachmentViewEmbed, {
			template: html`
				<d2l-labs-attachment-view-embed
					src="${embedUrl}"
				>
				</d2l-labs-attachment-view-embed>
			`,
		}),
	)
	.add('max-height', () =>
		withClassPropertiesKnobs(AttachmentViewEmbed, {
			template: html`
				<d2l-labs-attachment-view-embed
					src="${embedUrl}"
					maxheight="200"
				>
				</d2l-labs-attachment-view-embed>
			`,
		})
	);


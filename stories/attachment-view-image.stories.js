import { html, storiesOf, withClassPropertiesKnobs, withKnobs } from '@open-wc/demoing-storybook';

import { AttachmentViewImage } from '../attachment-view-image.js';

const src = 'https://ichef.bbci.co.uk/wwfeatures/live/624_351/images/live/p0/7p/sr/p07psr8q.jpg';

storiesOf('Views|attachment-view-image', module)
	.addDecorator(withKnobs)
	.add('default', () =>
		withClassPropertiesKnobs(AttachmentViewImage, {
			template: html`
				<d2l-labs-attachment-view-image
					src="${src}"
					name="Conversation runs out quickly when talking to a newborn. They don’t say anything back. They won’t groan when you tell them it’s going to rain, or smile when you tell a joke."
				></d2l-labs-attachment-view-image>
			`,
		}),
	)
	.add('no name', () =>
		withClassPropertiesKnobs(AttachmentViewImage, {
			template: html`
				<d2l-labs-attachment-view-image src="${src}"></d2l-labs-attachment-view-image>
			`,
		}),
	);

import {
	html,
	storiesOf,
	withClassPropertiesKnobs,
	withKnobs
} from '@open-wc/demoing-storybook';

import { AttachmentViewImageLink } from '../attachment-view-imagelink.js';

const src = 'https://ichef.bbci.co.uk/wwfeatures/live/624_351/images/live/p0/7p/sr/p07psr8q.jpg';

storiesOf('Views|attachment-view-imagelink', module)
	.addDecorator(withKnobs)
	.add('default', () => withClassPropertiesKnobs(AttachmentViewImageLink, {
		template: html`
			<d2l-labs-attachment-view-imagelink src="${src}"></d2l-labs-attachment-view-imagelink>
		`
	}));

import {
	html,
	storiesOf,
	withClassPropertiesKnobs,
	withKnobs,
} from '@open-wc/demoing-storybook';

import { AttachmentViewInfo } from '../components/views/attachment-view-info.js';

const falseParam = false;

// eslint-disable-next-line max-len
const longDescription = 'The best of the BBC, with the latest news and sport headlines, weather, TV and radio highlights and much more from across the whole of BBC Online';

storiesOf('Views|attachment-view-info', module)
	.addDecorator(withKnobs)
	.add('name, label', () => withClassPropertiesKnobs(AttachmentViewInfo, {
		template: html`
			<d2l-labs-attachment-view-info
				name="The BBC" href="http://bbc.co.uk"
				target="_blank" label="bbc.co.uk">
			</d2l-labs-attachment-view-info>
		`
	}))
	.add('name, label, noopen', () => withClassPropertiesKnobs(AttachmentViewInfo, {
		template: html`
			<d2l-labs-attachment-view-info
				.canOpen="${falseParam}"
				name="The BBC"
				href="http://bbc.co.uk"
				target="_blank"
				label="bbc.co.uk">
			</d2l-labs-attachment-view-info>
		`
	}))
	.add('name, label, description', () => withClassPropertiesKnobs(AttachmentViewInfo, {
		template: html`
			<d2l-labs-attachment-view-info
				name="The BBC" href="http://bbc.co.uk"
				target="_blank" label="bbc.co.uk"
				description="${longDescription}">
			</d2l-labs-attachment-view-info>
		`
	}));

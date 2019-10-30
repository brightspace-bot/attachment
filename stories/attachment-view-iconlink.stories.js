import {
	html,
	storiesOf,
	withClassPropertiesKnobs,
	withKnobs,
} from '@open-wc/demoing-storybook';

import { AttachmentViewIconLink } from '../attachment-view-iconlink.js';

const falseParam = false;
const favIcon = 'https://www.bbc.co.uk/favicon.ico';
const invalidFavIcon = 'https://www.bbc.co.uk/invalid-favicon.ico';

storiesOf('Views|attachment-view-iconlink', module)
	.addDecorator(withKnobs)
	.add('default', () =>
		withClassPropertiesKnobs(AttachmentViewIconLink, {
			template: html`
				<d2l-labs-attachment-view-iconlink icon="link"></d2l-labs-attachment-view-iconlink>
			`,
		}),
	)
	.add('nopen', () =>
		withClassPropertiesKnobs(AttachmentViewIconLink, {
			template: html`
				<d2l-labs-attachment-view-iconlink
					.canOpen="${falseParam}"
					icon="link"
				></d2l-labs-attachment-view-iconlink>
			`,
		}),
	)
	.add('favicon', () =>
		withClassPropertiesKnobs(AttachmentViewIconLink, {
			template: html`
				<d2l-labs-attachment-view-iconlink .src="${favIcon}" icon="link"></d2l-labs-attachment-view-iconlink>
			`,
		}),
	)
	.add('favicon error', () =>
		withClassPropertiesKnobs(AttachmentViewIconLink, {
			template: html`
				<d2l-labs-attachment-view-iconlink
					.src="${invalidFavIcon}"
					icon="link"
				></d2l-labs-attachment-view-iconlink>
			`,
		}),
	);

import { html, storiesOf, withClassPropertiesKnobs, withKnobs } from '@open-wc/demoing-storybook';

import { AttachmentViewVideo } from '../components/views/attachment-view-video.js';

const url = 'https://www.youtube.com/watch?v=pEQjJKFTfHI';
const embedUrl = 'https://www.youtube.com/embed/pEQjJKFTfHI?feature=oembed';
const thumbnailUrl = 'https://i.ytimg.com/vi/pEQjJKFTfHI/hqdefault.jpg';

storiesOf('Views|attachment-view-video', module)
	.addDecorator(withKnobs)
	.add('default', () =>
		withClassPropertiesKnobs(AttachmentViewVideo, {
			template: html`
				<d2l-labs-attachment-view-video
					url="${url}"
					src="${embedUrl}"
					thumbnailUrl="${thumbnailUrl}"
				>
				</d2l-labs-attachment-view-video>
			`,
		}),
	);

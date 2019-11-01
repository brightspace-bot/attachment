import {
	html,
	storiesOf,
	withClassPropertiesKnobs,
	withKnobs,
} from '@open-wc/demoing-storybook';

import { AttachmentList } from '../components/attachment-list.js';

storiesOf('Attachments|attachment-list', module)
	.addDecorator(withKnobs)
	.add('default', () => withClassPropertiesKnobs(AttachmentList, {
		template: html`
			<d2l-labs-attachment-list>
				<li slot="attachment">Attachment 1</li>
				<li slot="attachment">Attachment 2</li>
			</d2l-labs-attachment-list>
		`
	}));

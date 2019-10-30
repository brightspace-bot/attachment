import { html, storiesOf, withClassPropertiesKnobs, withKnobs } from '@open-wc/demoing-storybook';
import { AttachmentViewDeleted } from '../components/views/attachment-view-deleted.js';
import { decorate } from '@storybook/addon-actions';

const pickDetail = decorate([args => args[0].detail]);

const attachment = {
	id: '1',
	name: 'Attachment 4',
	url:
		'http://localhost/d2l/common/dialogs/quickLink/quickLink.d2l?ou=123061&type=dropbox&rcode=6CF2AEF1-C439-4177-8784-6EAAC5432652-324',
};

storiesOf('Views|attachment-view-deleted', module)
	.addDecorator(withKnobs)
	.addDecorator(pickDetail.withActions('d2l-attachment-restored'))
	.add('default', () =>
		withClassPropertiesKnobs(AttachmentViewDeleted, {
			template: html`
				<d2l-labs-attachment-view-deleted .attachment="${attachment}"></d2l-labs-attachment-view-deleted>
			`,
		}),
	);

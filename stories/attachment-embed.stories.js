import 'd2l-fetch/d2l-fetch.js';
import './stub-unfurl-provider.js';
import '../attachment.js';
import { html, storiesOf, withKnobs } from '@open-wc/demoing-storybook';
import { boolean } from '@storybook/addon-knobs';
import fetchMock from 'fetch-mock';

const browserFetch = fetch;
const trueProp = true;
const falseProp = false;
const endpoint = 'http://localhost/api/v1/unfurl';

const attachmentWithQuizletEmbed = {
	id: '1',
	embed:
		'<iframe src="https://quizlet.com/286716956/match/embed?x=1jj1" height="500" width="100%" style="border:0"></iframe>',
	url: 'https://quizlet.com/286716956/match/embed?x=1jj1',
};

const unfurlQuizlet = {
	class: [],
	properties: {
		url: 'https://quizlet.com/286716956/match/embed?x=1jj1',
		thumbnailUrl: 'https://quizlet.com/a/i/share/share-match.ba7758e7d04a432.png',
		title: 'Types of Flowers',
		description: '5 terms · Bee Balm, Witch hazel, Echinacea, Sunflower, Mint',
	},
};

const delay = (response, after = 500) => () =>
	new Promise(resolve => setTimeout(resolve, after)).then(() => response);

storiesOf('Attachments|attachment-embed', module)
	.addDecorator(withKnobs)
	.add(
		'Embed Quizlet',
		() => {
			fetchMock
				.restore()
				.getOnce(
					`http://localhost/api/v1/unfurl/${encodeURIComponent(
						'https://quizlet.com/286716956/match/embed?x=1jj1',
					)}`,
					delay(unfurlQuizlet),
				)
				.catch(unmatchedUrl => browserFetch(unmatchedUrl));

			const immersive = boolean('immersive', false);
			const edit = boolean('isEditMode', false);

			return html`
				<d2l-stub-unfurl-provider endpoint="${endpoint}" ?trusted="${trueProp}">
					<d2l-labs-attachment .attachment=${attachmentWithQuizletEmbed} ?immersive="${immersive}" ?isEditMode="${edit}"></d2l-labs-attachment>
				</d2l-stub-unfurl-provider>
			`;
		},
		{
			knobs: {
				escapeHTML: false,
			},
		},
	)
	.add(
		'Untrusted',
		() => {
			fetchMock
				.restore()
				.getOnce(
					`http://localhost/api/v1/unfurl/${encodeURIComponent(
						'https://quizlet.com/286716956/match/embed?x=1jj1',
					)}`,
					delay(unfurlQuizlet),
				)
				.catch(unmatchedUrl => browserFetch(unmatchedUrl));

			const immersive = boolean('immersive', false);
			const edit = boolean('isEditMode', false);

			return html`
				<d2l-stub-unfurl-provider endpoint="${endpoint}" ?trusted="${falseProp}">
					<d2l-labs-attachment .attachment=${attachmentWithQuizletEmbed} ?immersive="${immersive}" ?isEditMode="${edit}"></d2l-labs-attachment>
				</d2l-stub-unfurl-provider>
			`;
		},
		{
			knobs: {
				escapeHTML: false,
			},
		},
	)
	.add(
		'No Trust Provider',
		() => {
			fetchMock
				.restore()
				.getOnce(
					`http://localhost/api/v1/unfurl/${encodeURIComponent(
						'https://quizlet.com/286716956/match/embed?x=1jj1',
					)}`,
					delay(unfurlQuizlet),
				)
				.catch(unmatchedUrl => browserFetch(unmatchedUrl));

			const immersive = boolean('immersive', false);
			const edit = boolean('isEditMode', false);

			return html`
				<d2l-stub-unfurl-provider endpoint="${endpoint}">
					<d2l-labs-attachment .attachment=${attachmentWithQuizletEmbed} ?immersive="${immersive}" ?isEditMode="${edit}"></d2l-labs-attachment>
				</d2l-stub-unfurl-provider>
				`;
		},
		{
			knobs: {
				escapeHTML: false,
			},
		},
	)
	.add(
		'No Unfurl Provider',
		() => {
			const immersive = boolean('immersive', false);
			const edit = boolean('isEditMode', false);

			return html`
				<d2l-labs-attachment .attachment=${attachmentWithQuizletEmbed} ?immersive="${immersive}" ?isEditMode="${edit}"></d2l-labs-attachment>
			`;
		},
		{
			knobs: {
				escapeHTML: false,
			},
		},
	);

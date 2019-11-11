import 'd2l-fetch/d2l-fetch.js';
import '../components/attachment.js';
import './stub-unfurl-provider.js';
import { html, storiesOf, withKnobs } from '@open-wc/demoing-storybook';
import { boolean } from '@storybook/addon-knobs';
import fetchMock from 'fetch-mock';

const browserFetch = fetch;
const trueProp = true;
const endpoint = 'http://localhost/api/v1/unfurl';

const attachment = {
	id: '1',
	name: 'BBC UK',
	url: 'http://bbc.co.uk',
};

const noFavIcon = {
	properties: {
		providerUrl: 'The-Beeb',
		description:
			'The best of the BBC, with the latest news and sport headlines, weather, TV and radio highlights and much more from across the whole of BBC Online', // eslint-disable-line max-len
	},
};

const unfurlFavIcon = {
	properties: {
		providerUrl: 'The-Beeb',
		description:
			'The best of the BBC, with the latest news and sport headlines, weather, TV and radio highlights and much more from across the whole of BBC Online', // eslint-disable-line max-len
		favicon: 'https://www.bbc.co.uk/favicon.ico',
	},
};

const unfurlFavIconError = {
	properties: { ...unfurlFavIcon.properties, favicon: 'https://www.bbc.co.uk/invalid-favicon.ico' },
};

const attachmentWithImageLink = {
	id: '1',
	url:
		'http://www.bbc.com/future/story/20191001-the-word-gap-that-affects-how-your-babys-brain-grows',
	name: 'Why the way we talk to children really matters',
};

const unfurlImageLink = {
	class: [],
	properties: {
		url:
			'http://www.bbc.com/future/story/20191001-the-word-gap-that-affects-how-your-babys-brain-grows',
		type: 'article',
		thumbnailUrl:
			'https://ichef.bbci.co.uk/wwfeatures/live/624_351/images/live/p0/7p/sr/p07psr8q.jpg',
		title: 'Why the way we talk to children really matters',
		description:
			'There could be a simple way to help young children’s brains improve for the better, with long-lasting benefits.',
		favicon: 'http://www.bbc.com/favicon.ico',
	},
};

const delay = (response, after = 500) => () =>
	new Promise(resolve => setTimeout(resolve, after)).then(() => response);

storiesOf('Attachments|attachment-url', module)
	.addDecorator(withKnobs)
	.add(
		'no favicon',
		() => {
			fetchMock
				.restore()
				.getOnce(
					`http://localhost/api/v1/unfurl/${encodeURIComponent('http://bbc.co.uk')}`,
					delay(noFavIcon),
				)
				.catch(unmatchedUrl => browserFetch(unmatchedUrl));

			const edit = boolean('editing', false);
			return html`
				<d2l-stub-unfurl-provider endpoint="${endpoint}" ?trusted="${trueProp}">
					<d2l-labs-attachment .attachment=${attachment} ?editing="${edit}"></d2l-labs-attachment>
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
		'favicon',
		() => {
			fetchMock
				.restore()
				.getOnce(
					`http://localhost/api/v1/unfurl/${encodeURIComponent('http://bbc.co.uk')}`,
					delay(unfurlFavIcon),
				)
				.catch(unmatchedUrl => browserFetch(unmatchedUrl));

			const edit = boolean('editing', false);
			return html`
				<d2l-stub-unfurl-provider endpoint="${endpoint}" ?trusted="${trueProp}">
					<d2l-labs-attachment .attachment=${attachment} ?editing="${edit}"></d2l-labs-attachment>
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
		'favicon error',
		() => {
			fetchMock
				.restore()
				.getOnce(
					`http://localhost/api/v1/unfurl/${encodeURIComponent('http://bbc.co.uk')}`,
					delay(unfurlFavIconError),
				)
				.catch(unmatchedUrl => browserFetch(unmatchedUrl));

			const edit = boolean('editing', false);
			return html`
				<d2l-stub-unfurl-provider endpoint="${endpoint}" ?trusted="${trueProp}">
					<d2l-labs-attachment .attachment=${attachment} ?editing="${edit}"></d2l-labs-attachment>
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
		'image link',
		() => {
			fetchMock
				.restore()
				.getOnce(
					`http://localhost/api/v1/unfurl/${encodeURIComponent(
						'http://www.bbc.com/future/story/20191001-the-word-gap-that-affects-how-your-babys-brain-grows',
					)}`,
					delay(unfurlImageLink),
				)
				.catch(unmatchedUrl => browserFetch(unmatchedUrl));

			const edit = boolean('editing', false);
			return html`
				<d2l-stub-unfurl-provider endpoint="${endpoint}" ?trusted="${trueProp}">
					<d2l-labs-attachment .attachment=${attachmentWithImageLink} ?editing="${edit}"></d2l-labs-attachment>
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
		'unfurl error',
		() => {
			const edit = boolean('editing', false);
			return html`
				<d2l-stub-unfurl-provider endpoint="${endpoint}" ?trusted="${trueProp}">
					<d2l-labs-attachment .attachment=${attachmentWithImageLink} ?editing="${edit}"></d2l-labs-attachment>
				</d2l-stub-unfurl-provider>
			`;
		},
		{
			knobs: {
				escapeHTML: false,
			},
		},
	);

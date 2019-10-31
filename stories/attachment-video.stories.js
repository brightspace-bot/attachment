import 'd2l-fetch/d2l-fetch.js';
import '../components/attachment.js';
import './stub-unfurl-provider.js';
import { html, storiesOf, withKnobs } from '@open-wc/demoing-storybook';
import { boolean } from '@storybook/addon-knobs';

import fetchMock from 'fetch-mock';

const browserFetch = fetch;
const trueProp = true;
const falseProp = false;
const endpoint = 'http://localhost/api/v1/unfurl';

const attachmentWithYoutube = {
	id: '1',
	url: 'https://www.youtube.com/watch?v=pEQjJKFTfHI',
};

const unfurlYoutube = {
	class: [],
	properties: {
		url: 'https://www.youtube.com/watch?v=pEQjJKFTfHI',
		type: 'Video',
		embedUrl: 'https://www.youtube.com/embed/pEQjJKFTfHI?feature=oembed',
		thumbnailUrl: 'https://i.ytimg.com/vi/pEQjJKFTfHI/hqdefault.jpg',
		title: 'GCNs Classic Rides | Vancouver - British Columbia: Canadas Cycling Hotbed',
		description:
			'Jeremy toured the sights and sounds of Vancouver by bike, to discover the best roads and cycling culture that British Columbia has to offer.',
	},
};

const unfurledAttachmentWithYoutubeNoName = {
	'type': 'Video',
	'url': [
		{
			'type': 'Link',
			'href': 'https://www.youtube.com/watch?v=pEQjJKFTfHI',
			'rel': [
				'self'
			]
		},
		{
			'type': 'Link',
			'href': 'https://www.youtube.com/embed/pEQjJKFTfHI?feature=oembed',
			'rel': [
				'alternate'
			]
		},
		{
			'type': 'Link',
			'href': 'https://i.ytimg.com/vi/pEQjJKFTfHI/hqdefault.jpg',
			'rel': [
				'icon'
			]
		}
	],
	'id': '3f57261a-55de-485d-b546-b0ab7322d724'
};

const unfurledAttachmentWithYoutube = {
	'type': 'Video',
	'name': 'GCNs Classic Rides | Vancouver - British Columbia: Canadas Cycling Hotbed',
	'url': [
		{
			'type': 'Link',
			'href': 'https://www.youtube.com/watch?v=pEQjJKFTfHI',
			'rel': [
				'self'
			]
		},
		{
			'type': 'Link',
			'href': 'https://www.youtube.com/embed/pEQjJKFTfHI?feature=oembed',
			'rel': [
				'alternate'
			]
		},
		{
			'type': 'Link',
			'href': 'https://i.ytimg.com/vi/pEQjJKFTfHI/hqdefault.jpg',
			'rel': [
				'icon'
			]
		}
	],
	'id': '3f57261a-55de-485d-b546-b0ab7322d724'
};

const delay = (response, after = 500) => () =>
	new Promise(resolve => setTimeout(resolve, after)).then(() => response);

storiesOf('Attachments|attachment-video', module)
	.addDecorator(withKnobs)
	.add(
		'Youtube Video',
		() => {
			fetchMock
				.restore()
				.getOnce(
					`http://localhost/api/v1/unfurl/${encodeURIComponent(
						'https://www.youtube.com/watch?v=pEQjJKFTfHI',
					)}`,
					delay(unfurlYoutube),
				)
				.catch(unmatchedUrl => browserFetch(unmatchedUrl));

			const edit = boolean('editing', false);

			return html`
				<d2l-stub-unfurl-provider endpoint="${endpoint}" ?trusted="${trueProp}">
					<d2l-labs-attachment .attachment=${attachmentWithYoutube} ?editing="${edit}"></d2l-labs-attachment>
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
		'Pre Unfurled',
		() =>
			html`
				<d2l-stub-unfurl-provider endpoint="${endpoint}" ?trusted="${trueProp}">
					<d2l-labs-attachment .attachment=${unfurledAttachmentWithYoutube}></d2l-labs-attachment>
				</d2l-stub-unfurl-provider>
			`,
		{
			knobs: {
				escapeHTML: false,
			},
		},
	)
	.add(
		'Pre Unfurled No name',
		() => {
			fetchMock
				.restore()
				.getOnce(
					`http://localhost/api/v1/unfurl/${encodeURIComponent(
						'https://www.youtube.com/watch?v=pEQjJKFTfHI',
					)}`,
					delay(unfurlYoutube),
				)
				.catch(unmatchedUrl => browserFetch(unmatchedUrl));

			return html`
				<d2l-stub-unfurl-provider endpoint="${endpoint}" ?trusted="${trueProp}">
					<d2l-labs-attachment .attachment=${unfurledAttachmentWithYoutubeNoName}></d2l-labs-attachment>
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
		'Pre Unfurled Untrusted',
		() => {
			fetchMock
				.restore()
				.getOnce(
					`http://localhost/api/v1/unfurl/${encodeURIComponent(
						'https://www.youtube.com/watch?v=pEQjJKFTfHI',
					)}`,
					delay(unfurlYoutube),
				)
				.catch(unmatchedUrl => browserFetch(unmatchedUrl));

			return html`
				<d2l-stub-unfurl-provider endpoint="${endpoint}" ?trusted="${falseProp}">
					<d2l-labs-attachment .attachment=${unfurledAttachmentWithYoutube}></d2l-labs-attachment>
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
						'https://www.youtube.com/watch?v=pEQjJKFTfHI',
					)}`,
					delay(unfurlYoutube),
				)
				.catch(unmatchedUrl => browserFetch(unmatchedUrl));

			const edit = boolean('editing', false);

			return html`
				<d2l-stub-unfurl-provider endpoint="${endpoint}" ?trusted="${falseProp}">
					<d2l-labs-attachment .attachment=${attachmentWithYoutube} ?editing="${edit}"></d2l-labs-attachment>
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
						'https://www.youtube.com/watch?v=pEQjJKFTfHI',
					)}`,
					delay(unfurlYoutube),
				)
				.catch(unmatchedUrl => browserFetch(unmatchedUrl));

			const edit = boolean('editing', false);

			return html`
				<d2l-stub-unfurl-provider endpoint="${endpoint}">
					<d2l-labs-attachment .attachment=${attachmentWithYoutube} ?editing="${edit}"></d2l-labs-attachment>
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

			const edit = boolean('editing', false);

			return html`
				<d2l-labs-attachment .attachment=${attachmentWithYoutube} ?editing="${edit}"></d2l-labs-attachment>
			`;
		},
		{
			knobs: {
				escapeHTML: false,
			},
		},
	);

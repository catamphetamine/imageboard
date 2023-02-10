import dropQuoteMarker from '../../../dropQuoteMarker.js'

import {
	bold,
	italic,
	quote,
	link
} from './parseCommentContentPlugins.js'

// `kohlchan.net` spoiler.
const spoiler = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'spoiler'
		}
	],
	createElement(content) {
		return {
			type: 'spoiler',
			content
		}
	}
}

// `kohlchan.net` and `8ch.net` have regular quotes and "inverse" quotes.
const inverseQuote = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'quote2'
		}
	],
	createElement(content) {
		content = dropQuoteMarker(content, '<')
		if (content) {
			return {
				type: 'quote',
				kind: 'inverse',
				// Make the quote appear as if it was a block one while staying inline.
				// This is just presentational.
				block: true,
				content
			}
		}
	}
}

// `kohlchan.net` underlined text.
const underline = {
	tag: 'span',
	attributes: [
		{
			name: 'style',
			value: 'text-decoration: underline'
		}
	],
	createElement(content) {
		return {
			type: 'text',
			style: 'underline',
			content
		}
	}
}

// `kohlchan.net` strikethrough text.
const strikethrough = {
	tag: 'span',
	attributes: [
		{
			name: 'style',
			value: 'text-decoration: line-through'
		}
	],
	createElement(content) {
		return {
			type: 'text',
			style: 'strikethrough',
			content
		}
	}
}

// `kohlchan.net` "inline" code element.
const code = {
	tag: 'code',
	createElement(content) {
		return {
			type: 'code',
			// `inline: true` flag is no longer used in `code` elements.
			// inline: true,
			content
		}
	}
}

export default [
	bold,
	italic,
	quote,
	link,
	spoiler,
	inverseQuote,
	underline,
	strikethrough,
	code
]
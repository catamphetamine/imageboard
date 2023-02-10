import dropQuoteMarker from '../../../dropQuoteMarker.js'

import {
	bold,
	italic,
	underline,
	link,
	code
} from './parseCommentContentPlugins.js'

const strikethrough = {
	tag: 's',
	createElement(content) {
		return {
			type: 'text',
			style: 'strikethrough',
			content
		}
	}
}

// `8ch.net` regular text.
const text = {
	tag: 'p',
	attributes: [
		{
			name: 'class',
			value: 'body-line ltr '
		}
	],
	createElement(content) {
		return appendNewLine(content)
	}
}

// `8ch.net` "ASCII art" or "ShiftJIS art".
const asciiShiftJisArt = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'aa'
		}
	],
	createElement(content) {
		return {
			type: 'text',
			style: 'ascii-shift-jis-art',
			content
		}
	}
}

// `8ch.net` new line.
const newLine = {
	tag: 'p',
	attributes: [
		{
			name: 'class',
			value: 'body-line empty '
		}
	],
	// Doesn't have any content.
	content: false,
	createElement() {
		return '\n'
	}
}

// `8ch.net` "(((detected)))" or "(((they)))" inline element.
const detected = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'detected'
		}
	],
	createElement(content) {
		return {
			type: 'code',
			// `inline: true` flag is no longer used in `code` elements.
			// inline: true,
			content
		}
	}
}

// `8ch.net` `<span class="small"/>`:
// .small {
// 	 color: #6a1de2;
// 	 font-size: 9pt;
// 	 font-weight: bold;
// }
const small = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'small'
		}
	],
	createElement(content) {
		return {
			type: 'text',
			style: 'subscript',
			content: [{
				type: 'text',
				style: 'bold',
				content
			}]
		}
	}
}

// `8ch.net` red heading.
const heading = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'heading'
		}
	],
	createElement(content) {
		return {
			type: 'text',
			style: 'heading',
			content
		}
	}
}

// `8ch.net` red heading (with side padding).
// `<span class="heading red-padding">...</span>`
// .red-padding {
//   padding-left: 3px;
//   padding-right: 3px;
// }
const headingWithSidePadding = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'heading red-padding'
		}
	],
	createElement(content) {
		return [' ', {
			type: 'text',
			style: 'heading',
			content
		}, ' ']
	}
}

// `8ch.net` spoiler.
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

// `8ch.net` quote.
const quote = {
	tag: 'p',
	attributes: [
		{
			name: 'class',
			value: 'body-line ltr quote'
		}
	],
	createElement(content) {
		content = dropQuoteMarker(content)
		if (content) {
			return appendNewLine({
				type: 'quote',
				// Make the quote appear as if it was a block one while staying inline.
				// This is just presentational.
				block: true,
				content
			})
		}
	}
}

// `kohlchan.net` and `8ch.net` have regular quotes and "inverse" quotes.
const inverseQuote = {
	tag: 'p',
	attributes: [
		{
			name: 'class',
			value: 'body-line ltr rquote'
		}
	],
	createElement(content) {
		content = dropQuoteMarker(content, '<')
		if (content) {
			return appendNewLine({
				type: 'quote',
				kind: 'inverse',
				// Make the quote appear as if it was a block one while staying inline.
				// This is just presentational.
				block: true,
				content
			})
		}
	}
}

export default [
	bold,
	italic,
	underline,
	strikethrough,
	link,
	code,
	text,
	asciiShiftJisArt,
	newLine,
	detected,
	small,
	headingWithSidePadding,
	heading,
	spoiler,
	small,
	quote,
	inverseQuote
]

function appendNewLine(content) {
	if (Array.isArray(content)) {
		return content.concat('\n')
	} else {
		return [content, '\n']
	}
}
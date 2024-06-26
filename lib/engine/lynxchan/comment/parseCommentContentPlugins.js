import createLink from '../../../utility/createLink.js'
import dropQuoteMarker from '../../../dropQuoteMarker.js'
import parsePostLinkUrl from '../../../parsePostLinkUrl.js'

const bold = {
	tag: 'strong',
	createElement(content) {
		return {
			type: 'text',
			style: 'bold',
			content
		}
	}
}

const italic = {
	tag: 'em',
	createElement(content) {
		return {
			type: 'text',
			style: 'italic',
			content
		}
	}
}

const underline = {
	tag: 'u',
	createElement(content) {
		return {
			type: 'text',
			style: 'underline',
			content
		}
	}
}

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

const quote = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'greenText'
		}
	],
	createElement(content) {
		content = dropQuoteMarker(content)
		if (content) {
			return {
				type: 'quote',
				// Make the quote appear as if it was a block one while staying inline.
				// This is just presentational.
				block: true,
				content
			}
		}
	}
}

// `lynxchan` has regular quotes and "inverse" (orange) quotes.
const inverseQuote = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'orangeText'
		}
	],
	createElement(content) {
		content = dropQuoteMarker(content, '<')
		if (content) {
			return {
				type: 'quote',
				// kind: 'inverse-orange',
				kind: 'inverse',
				// Make the quote appear as if it was a block one while staying inline.
				// This is just presentational.
				block: true,
				content
			}
		}
	}
}

// `8ch.net` "ASCII art" or "ShiftJIS art".
const asciiOrShiftJISArt = {
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

// Red heading.
const heading = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'redText'
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

const postLink = {
	tag: 'a',
	attributes: [{
		name: 'class',
		value: 'quoteLink'
	}],
	// Link parser plugin uses `commentUrlParser()` function
	// to detect links to other comments and extract
	// `commentId`/`threadId`/`boardId` info from such links.
	createElement(content, { getAttribute }, { commentUrlParser }) {
		const postLinkMeta = parsePostLinkUrl(getAttribute('href'), { commentUrlParser })
		return {
			type: 'post-link',
			meta: {
				boardId: postLinkMeta.boardId || null, // Will be overwritten anyway later in comment post-processing.
				threadId: postLinkMeta.threadId || null, // Will be overwritten anyway later in comment post-processing.
				commentId: postLinkMeta.commentId
			},
			content: content.slice('>>'.length),
			url: null // Will be overwritten anyway later in comment post-processing.
		}
	}
}

const link = {
	tag: 'a',
	createElement(content, { getAttribute }) {
		// "https://google.de/"
		return createLink(getAttribute('href'), content)
	}
}

export default [
	bold,
	italic,
	underline,
	strikethrough,
	spoiler,
	quote,
	inverseQuote,
	asciiOrShiftJISArt,
	heading,
	postLink,
	link
]
import createLink from '../../../utility/createLink.js'
import parsePostLinkUrl from '../../../parsePostLinkUrl.js'
import dropQuoteMarker from '../../../dropQuoteMarker.js'

const bold = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'bold'
		}
	],
	createElement(content) {
		return {
			type: 'text',
			style: 'bold',
			content
		}
	}
}

const italic = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'em'
		}
	],
	createElement(content) {
		return {
			type: 'text',
			style: 'italic',
			content
		}
	}
}

const underline = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'underline'
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

const strikethrough = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'strike'
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

const code = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'mono'
		}
	],
	createElement(content) {
		return {
			type: 'code',
			// `inline: true` flag is no longer used in `code` elements.
			// Instead, `code` elements are automatically determined being block or non-block
			// based on their position ("level of nestedness") in the comment `content`.
			// inline: true,
			content
		}
	}
}

const multilineCode = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'code'
		}
	],
	createElement(content) {
		return {
			type: 'code',
			content
		}
	}
}

// "ASCII art" or "ShiftJIS art".
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

export const quote = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'greentext'
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

const inverseQuote = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'pinktext'
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

// Red heading.
const heading = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'title'
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

// `8ch.net`-alike "(((detected)))" or "(((they)))" inline element.
// Triple parentheses imply "jews".
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
			// Instead, `code` elements are automatically determined being block or non-block
			// based on their position ("level of nestedness") in the comment `content`.
			// inline: true,
			content
		}
	}
}

// `<small/>` tags are removed in `parseComment.js` instead.
// The reason is that if they were removed here by returning `null`,
// they'd still leave the two whitespaces around themselves.
//
// // `94chan.org` seems to mark "(OP)" parts in post link quotes with `<small/>` tags:
// // `<a class="quote" href="/pol/thread/6471.html#6471">&gt;&gt;6471</a> <small>(OP)</small> \r\nkant sounds like a collectivist`.
// // So those `<small/>` tags are simply ignored.
// const small = {
// 	tag: 'small',
// 	createElement(content) {
// 		// Discard the `<small/>` tag.
// 		// When the `<small/>` tag will be removed, it will leave the two whitespaces around itself:
// 		// `<a class="quote" href="/pol/thread/6471.html#6471">&gt;&gt;6471</a>  \r\nkant sounds like a collectivist`.
// 		// That doesn't seem like an issue though.
// 		return null
// 	}
// }

const link = {
	tag: 'a',
	createElement(content, { getAttribute }, { commentUrlParser }) {
		const href = getAttribute('href')
		const postLinkMeta = parsePostLinkUrl(href, { commentUrlParser })
		if (postLinkMeta) {
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
		return createLink(href, content)
	}
}

const invalidPostLink = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'invalid-quote'
		}
	],
	createElement(content, {}, { commentMessageDefault }) {
		return {
			type: 'text',
			style: 'strikethrough',
			content: commentMessageDefault || content
		}
	}
}

export default [
	bold,
	italic,
	underline,
	strikethrough,
	code,
	multilineCode,
	asciiShiftJisArt,
	spoiler,
	quote,
	inverseQuote,
	heading,
	detected,
	// small,
	invalidPostLink,
	link
]

function appendNewLine(content) {
	if (Array.isArray(content)) {
		return content.concat('\n')
	} else {
		return [content, '\n']
	}
}
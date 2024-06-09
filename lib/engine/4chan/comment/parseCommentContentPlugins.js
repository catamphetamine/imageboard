import createLink from '../../../utility/createLink.js'
import dropQuoteMarker from '../../../dropQuoteMarker.js'
import parsePostLinkUrl from '../../../parsePostLinkUrl.js'

export const bold = {
	tag: 'strong',
	createElement(content) {
		return {
			type: 'text',
			style: 'bold',
			content
		}
	}
}

export const italic = {
	tag: 'em',
	createElement(content) {
		return {
			type: 'text',
			style: 'italic',
			content
		}
	}
}

export const underline = {
	tag: 'u',
	createElement(content) {
		return {
			type: 'text',
			style: 'underline',
			content
		}
	}
}

// They have code tags in `/g/`.
export const code = {
	tag: 'pre',
	// Don't parse child elements.
	convertContentToText: true,
	attributes: [
		{
			name: 'class',
			value: 'prettyprint'
		}
	],
	// This is a "block" code element, not an "inline" one.
	block: true,
	createElement(content) {
		return {
			type: 'code',
			content
		}
	}
}

export const quote = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'quote'
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

export const link = {
	tag: 'a',
	// Link parser plugin uses `commentUrlParser()` function
	// to detect links to other comments and extract
	// `commentId`/`threadId`/`boardId` info from such links.
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
		if (href[0] === '/') {
			if (href[1] === '/') {
				// "//boards.4chan.org/wsr/"
				return createLink(href, content.slice('//'.length))
			} else {
				// "/r/"
				return createLink(href, content)
			}
		} else {
			// "https://boards.4chan.org/wsr/"
			return createLink(href, content)
		}
	}
}

// They have these in `/g/` for some reason.
const boldLegacy = {
	tag: 'b',
	createElement(content) {
		return {
			type: 'text',
			style: 'bold',
			content
		}
	}
}

// They have these in `/g/` for some reason.
const italicLegacy = {
	tag: 'i',
	createElement(content) {
		return {
			type: 'text',
			style: 'italic',
			content
		}
	}
}

// 4chan.org spoiler.
const spoiler = {
	tag: 's',
	createElement(content) {
		return {
			type: 'spoiler',
			content
		}
	}
}

const deletedLink = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'deadlink'
		}
	],
	// The `correctContent` property doesn't seem to be used.
	// // Won't "unescape" content (for some reason).
	// correctContent: false,
	createElement(content) {
		content = content.slice('>>'.length)
		return {
			type: 'post-link',
			meta: {
				boardId: null, // Will be overwritten anyway later in comment post-processing.
				threadId: null, // Will be overwritten anyway later in comment post-processing.
				commentId: parseInt(content)
			},
			content,
			url: null // Will be overwritten anyway later in comment post-processing.
		}
	}
}

// "ASCII art" or "ShiftJIS art".
const asciiShiftJisArt = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'sjis'
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

// They also have things like:
// * `<span style="color:#789922;">...</span>`
// * `<span class="fortune" style="color:#789922;">...</span>`
// * `<span style="color: red; font-size: xx-large;">...</span>`
// * `<font size="4">...</font>`
// * `<font color="red">...</font>`
// * `<img src="//static.4chan.org/image/temp/dinosaur.gif"/>`
// * `<span style="font-size:20px;font-weight:600;line-height:120%">...</span>`
// * `<ul/>`/`<li/>`
// * `<h1/>`
// * `<blink/>`
// * `<div align="center"/>`
// * There're even `<table/>`s in "Photography"
export default [
	bold,
	boldLegacy,
	italic,
	italicLegacy,
	underline,
	spoiler,
	quote,
	// `deletedLink` must precede `link`.
	deletedLink,
	link,
	code,
	asciiShiftJisArt
]
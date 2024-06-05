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
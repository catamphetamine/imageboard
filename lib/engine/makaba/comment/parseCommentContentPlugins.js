import dropQuoteMarker from '../../../dropQuoteMarker.js'
import createLink from '../../../utility/createLink.js'

const inlineQuote = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'unkfunc'
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

const quote = {
	tag: 'div',
	attributes: [
		{
			name: 'class',
			value: 'quote'
		}
	],
	createElement(content) {
		return {
			type: 'quote',
			// Make the quote appear as if it was a block one while staying inline.
			// This is just presentational.
			block: true,
			content
		}
	}
}

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

// There's `<b>` in a pinned index post in `/sn/`, for example.
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

// There seems to be no `<i>`s on 2ch.hk.
// Still some "advanced" users (like moderators) may potentially
// use it in their "advanced" custom markup (like pinned index posts).
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

const subscript = {
	tag: 'sub',
	createElement(content) {
		return {
			type: 'text',
			style: 'subscript',
			content
		}
	}
}

const superscript = {
	tag: 'sup',
	createElement(content) {
		return {
			type: 'text',
			style: 'superscript',
			content
		}
	}
}

const strikethrough = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 's'
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

const underline = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'u'
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

// Sometimes moderators use direct HTML markup in opening posts.
const underlineTag = {
	tag: 'u',
	createElement(content) {
		return {
			type: 'text',
			style: 'underline',
			content
		}
	}
}

const overline = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'o'
		}
	],
	createElement(content) {
		return {
			type: 'text',
			style: 'overline',
			content
		}
	}
}

const link = {
	tag: 'a',
	createElement(content, { getAttribute }) {
		// Both board page and thread page:
		// `<a href="/b/res/197765456.html#197791215" class="post-reply-link" data-thread="197765456" data-num="197791215">&gt;&gt;197791215</a>`
		const href = getAttribute('href')
		if (getAttribute('data-thread')) {
			const threadId = getAttribute('data-thread')
			const postId = getAttribute('data-num')
			// There have been cases when this regexp didn't match.
			const boardIdMatch = href.match(/^\/([^\/]+)/)
			if (boardIdMatch) {
				return {
					type: 'post-link',
					boardId: boardIdMatch[1],
					threadId: parseInt(threadId),
					postId: parseInt(postId),
					content: content.slice('>>'.length),
					url: `https://2ch.hk${href}`
				}
			}
		}
		return createLink(href, content)
	}
}

// There's some `style` in a pinned index post in `/sn/`, for example.
const style = {
	tag: 'style',
	createElement() {
		return
	}
}

// There's some `script` in a pinned index post in `/sn/`, for example.
const script = {
	tag: 'script',
	createElement() {
		return
	}
}

// // Don't know what's this for.
// // <span class="thanks-abu" style="color: red;">Абу благословил этот пост.</span>
// const parseThanksAbu = {
// 	tag: 'span',
// 	attributes: [
// 		{
// 			name: 'class',
// 			value: 'thanks-abu'
// 		}
// 	],
// 	createElement() {
// 		return
// 	}
// }

export default [
	inlineQuote,
	quote,
	link,
	bold,
	boldLegacy,
	italic,
	italicLegacy,
	strikethrough,
	underline,
	underlineTag,
	overline,
	spoiler,
	subscript,
	superscript,
	style,
	script
]
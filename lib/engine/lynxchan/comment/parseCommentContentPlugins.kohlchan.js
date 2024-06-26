import createLink from '../../../utility/createLink.js'
import dropQuoteMarker from '../../../dropQuoteMarker.js'
import parsePostLinkUrl from '../../../parsePostLinkUrl.js'

import PARSE_COMMENT_CONTENT_PLUGINS from './parseCommentContentPlugins.js'

// Since May 28th, 2019 `kohlchan.net` has been migrated from `vichan` to `lynxchan`.
// The old messages still have the old markup.
import LEGACY_MARKUP_PLUGINS from '../../vichan/comment/parseCommentContentPlugins.kohlchan.js'

const EMOTE_ID_REG_EXP = /^\/\.static\/images\/([^/]+)\.png$/

const emoji = {
	tag: 'img',
	attributes: [
		{
			name: 'class',
			value: /^emote\s?/
		}
	],
	// `kohlchan` emoji don't have `content`.
	content: false,
	createElement(content, { getAttribute }, { emojiUrl }) {
		const url = getAttribute('src')
		// "/.static/images/chen.png" -> "chen"
		const match = url.match(EMOTE_ID_REG_EXP)
		return {
			type: 'emoji',
			name: match ? match[1] : 'emoji',
			url: emojiUrl ? emojiUrl.replace('{url}', url) : url
		}
	}
}

// `highlightlink` is for old `kohlchan.net` links.
// (before it moved to `lynxchan` on May 2019)
// `quoteLink` if for new `kohlchan.net` links.
// Perhaps they somehow migrated the old posts
// and didn't insert the correct CSS class name.
// The "legacy" markup is also different.
// Sometimes it's:
// `<a onclick="highlightReply('32', event);" href="/a/res/24.html#32">>>32</a>`
// Sometimes it's:
// `<a class="highlightlink" related="297" href="/a/res/297.html#297">>>297</a>`
const quoteLinkLegacy1 = {
	tag: 'a',
	attributes: [{
		name: 'onclick',
		value: /^highlightReply/
	}],
	// Link parser plugin uses `commentUrlParser()` function
	// to detect links to other comments and extract
	// `commentId`/`threadId`/`boardId` info from such links.
	createElement: createPostLink
}
const quoteLinkLegacy2 = {
	tag: 'a',
	attributes: [{
		name: 'class',
		value: 'highlightlink'
	}],
	createElement: createPostLink
}

// Link parser plugin uses `commentUrlParser()` function
// to detect links to other comments and extract
// `commentId`/`threadId`/`boardId` info from such links.
function createPostLink(content, { getAttribute }, { commentUrlParser }) {
	const href = getAttribute('href')
	const postLinkMeta = parsePostLinkUrl(href, { commentUrlParser })
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

// "Block" code element.
const multilineCode = {
	tag: 'code',
	block: true,
	createElement(content) {
		return {
			type: 'code',
			content
		}
	}
}

export default [
	emoji,
	quoteLinkLegacy1,
	quoteLinkLegacy2,
	multilineCode,
	...PARSE_COMMENT_CONTENT_PLUGINS,
	...LEGACY_MARKUP_PLUGINS
]
import unescapeContent from '../../../utility/unescapeContent.js'

import parseAuthorRole from './parseAuthorRole.js'
import parseAuthor from './parseAuthor.js'
import parseCountryFlagUrl from './parseCountryFlagUrl.js'
import parseCountryFlagCode from './parseCountryFlagCode.js'
import parseAttachments from './parseAttachments.js'

/**
 * Parses response comment JSON object.
 * @param  {object} comment — Response comment JSON object.
 * @param  {object} options
 * @return {object} See README.md for "Comment" object description.
 */
export default function parseComment(post, {
	chan,
	boardId,
	attachmentUrl,
	attachmentThumbnailUrl,
	thumbnailSize,
	toAbsoluteUrl,
	defaultAuthorName,
	capcode
}, {
	thread: {
		id: threadId
	}
}) {
	// Fixes LynxChan new line characters.
	// `post.markdown` is not really "markdown", it's HTML.
	const content = fixNewLineCharacters(post.markdown)
	const authorRole = parseAuthorRole(post, { capcode })
	const author = parseAuthor(post.name, { defaultAuthorName, boardId })
	const comment = {
		boardId,
		threadId,
		// `threadId` is present in "get threads list" API response
		// and at the root level (the "opening comment") of "get thread comments" API response.
		// `postId` is present in "get thread comments" API response
		// for all comments except the "opening comment".
		id: post.threadId || post.postId,
		// In `/catalog.json` API response there's no `creation` property which is a bug.
		// http://lynxhub.com/lynxchan/res/722.html#q984
		createdAt: post.creation && new Date(post.creation),
		// I guess `lastEditTime` won't be present in `/catalog.json` API response.
		updatedAt: post.lastEditTime && new Date(post.lastEditTime),
		// `post.subject` is `null` when there's no comment subject.
		// `lynxchan` thread subject sometimes contains
		// escaped characters like "&quot;", "&lt;", "&gt;".
		title: post.subject && unescapeContent(post.subject),
		content,
		authorName: author && author.name,
		authorEmail: post.email,
		authorTripCode: author && author.tripCode,
		// Imageboards identify their posters by a hash of their IP addresses on some boards.
		// A three-byte hex string (like "d1e8f1").
		authorId: post.id,
		authorRole: authorRole && (typeof authorRole === 'object' ? authorRole.role : authorRole),
		authorRoleScope: authorRole && (typeof authorRole === 'object' ? authorRole.scope : undefined),
		authorBan: post.banMessage && true,
		authorBanReason: post.banMessage, // '(USER WAS BANNED FOR THIS POST)'
		attachments: parseAttachments(post, {
			chan,
			boardId,
			attachmentUrl,
			attachmentThumbnailUrl,
			thumbnailSize,
			toAbsoluteUrl
		})
	}

	// `kohlchan.net` displays comment author country flag
	// on boards like `/int/`.
	//
	// Some "flags" aren't country flags
	// but rather region flags or even an "Anonymous" flag.
	// Such "flags" are interpreted as "badges".
	//
	// `post.flagCode` is `null` for "Onion" flag:
	// ```
	// flag: "/.static/flags/onion.png"
	// flagCode: null
	// flagName: "Onion"
	// ```
	let country
	if (post.flag) {
		country = parseCountryFlagUrl(post.flag)
	}
	if (!country) {
		if (post.flagCode) {
			country = parseCountryFlagCode(post.flagCode)
		}
	}
	if (country) {
		comment.authorCountry = country
	} else {
		comment.authorBadgeUrl = post.flag
		comment.authorBadgeName = post.flagName
	}

  // A thread could be moved to a "trash bin" in LynxChan >= 2.8:
  // "Trash post only hides the post from the public and can be restored
  //  later by staff. Delete post permanently deletes it."
  // I assume, that means that threads from the "trash bin"
  // are only visible to the staff and not to the public.
	// if (post.trash) {
	// 	comment.hidden = true
	// }

	return comment
}

/**
 * Fixes LynxChan "new line" delimiters.
 * Lynxchan (at least on KohlChan) has a bug
 * of inserting "carriage return" (U+000D)
 * characters before every "new line" (<br>).
 * This workaround fixes that.
 * Also, since Lynxchan 2.3 (at least on KohlChan),
 * all line breaks have been changed from `<br/>` to `\n`.
 * That's a weird change, but whatever,
 * I'll just replace all `\n`s with `<br>`s.
 */
// Is exported only for testing.
export function fixNewLineCharacters(html) {
	// `lynxchan` has a bug of inserting "carriage return" (`\r`)
	// (U+000D) (String.charCodeAt() === 13) characters before
	// every "new line" (`\n`) (String.charCodeAt() === 10).
	// This workaround fixes that.
	// For example, it's relevant on KohlChan,
	// both before and after migrating to LynxChan 2.3.
	html = html.replace(/\u000d/g, '')
	// On KohlChan, since migrating to LynxChan 2.3,
	// all line breaks have been changed from `<br/>` to `\n`.
	// That's a weird change, but whatever,
	// I'll just replace all `\n`s with `<br>`s.
	// (except in `<code/>` and `<span class="aa"/>` "Ascii/JIS-Art").
	return processExcept(replaceNewLinesWithBrs, html, [{
		tag: 'code'
	}, {
		tag: 'span',
		attributes: 'class="aa"'
	}, {
		// Added `<pre>` just in case.
		tag: 'pre'
	}])
}

function replaceNewLinesWithBrs(html) {
	return html.replace(/\n/g, '<br>')
}

function processExcept(process, html, tags) {
	for (const { tag, attributes } of tags) {
		const tagStartsAt = html.indexOf('<' + tag + (attributes ? ' ' + attributes : '') + '>')
		if (tagStartsAt >= 0) {
			const tagEndsAt = html.indexOf('</' + tag + '>', tagStartsAt)
			if (tagEndsAt >= 0) {
				return processExcept(process, html.slice(0, tagStartsAt), tags) +
					html.slice(tagStartsAt, tagEndsAt + 1) +
					processExcept(process, html.slice(tagEndsAt + 1), tags)
			}
		}
	}
	return process(html)
}
import unescapeContent from '../../../utility/unescapeContent'

import parseAuthorRole from './parseAuthorRole'
import parseAuthor from './parseAuthor'
import parseCountryFlagUrl from './parseCountryFlagUrl'
import parseAttachments from './parseAttachments'

/**
 * Parses response comment JSON object.
 * @param  {object} comment — Response comment JSON object.
 * @param  {object} options
 * @return {object} See README.md for "Comment" object description.
 */
export default function parseComment(post, {
	chan,
	boardId,
	threadId,
	attachmentUrl,
	attachmentThumbnailUrl,
	thumbnailSize,
	toAbsoluteUrl,
	defaultAuthorName,
	capcode
}) {
	// `post.markdown` is not really "markdown", it's HTML.
	// `lynxchan` has a bug of inserting "carriage return" (U+000D)
	// characters before every "new line" (<br>).
	// This workaround fixes that:
	const content = post.markdown.replace(/\u000d/g, '')
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
	if (post.flag) {
		const country = parseCountryFlagUrl(post.flag)
		if (country) {
			comment.authorCountry = country
		} else {
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
			// comment.authorBadgeId = flagId
			comment.authorBadgeUrl = post.flag
			comment.authorBadgeName = post.flagName
		}
	}
	return comment
}
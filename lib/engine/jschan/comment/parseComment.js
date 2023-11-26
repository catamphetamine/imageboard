import parseAttachments from './parseAttachments.js'

/**
 * Parses response thread JSON object.
 * @param  {object} thread — Response thread JSON object.
 * @param  {object} options
 * @return {object} See README.md for "Comment" object description.
 */
export default function parseComment(post, {
	authorBadgeUrl,
	attachmentUrl,
	attachmentThumbnailUrl,
	defaultAuthorName
}) {
	const comment = {
		boardId: post.board,
		threadId: post.thread || post.postId,
		id: post.postId,
		content: post.message,
		attachments: parseAttachments(post.files, {
			attachmentUrl,
			attachmentThumbnailUrl
		}),
		createdAt: new Date(post.date)
	}

	if (post.spoiler) {
		for (const attachment of comment.attachments) {
			attachment.spoiler = true
		}
	}

	if (post.subject) {
		comment.title = post.subject
	}

	if (post.edited) {
		comment.updatedAt = new Date(post.edited.date)
		// comment.updatedByAuthorName = new Date(post.edited.username)
	}

	if (post.country) {
		if (post.country.custom) {
			comment.authorBadgeUrl = authorBadgeUrl.replace('{boardId}', post.board).replace('{filename}', post.country.src)
			comment.authorBadgeName = post.country.name
		} else {
			// "T1" means "Tor exit nodes".
			if (post.country.code === 'TOR' || post.country.code === 'T1') {
				comment.authorCountry = 'ZZ'
			} else {
				comment.authorCountry = post.country.code
			}
		}
	}

	if (post.tripcode) {
		comment.authorTripCode = post.tripcode
	}

	if (post.capcode) {
		const authorRole = post.capcode.replace('## ', '')
		comment.authorRole = authorRole
	}

	if (post.email) {
		comment.authorEmail = post.email
	}

	if (post.name) {
		// It could also somehow pass `board.defaultAuthorName` to this function,
		// but `board` info is not present in "get thread" API response,
		// so it'd have to be passed as an additional parameter when making such
		// "get thread" API request. And not only "get thread" API, but also
		// "get threads on a board" API request.
		comment.authorName = parseAuthorName(post.name, { defaultAuthorName })
	}

	if (post.banmessage) {
		comment.authorBan = true
		comment.authorBanReason = post.banmessage
	}

	if (post.userId) {
		comment.authorId = post.userId
	}

	if (post.ip) {
		comment.authorIpAddress = post.ip.raw || post.ip.cloak
	}

	// I dunno if `post.message` is always present, even when there's no text in a comment.
	// So added an `if` here.
	if (comment.content) {
		// `94chan.org` seems to mark "(OP)" parts in post link quotes with `<small/>` tags:
		// `<a class="quote" href="/pol/thread/6471.html#6471">&gt;&gt;6471</a> <small>(OP)</small> \r\nkant sounds like a collectivist`.
		// So those `<small/>` tags are simply ignored, along with the two whitespaces around them.
		comment.content = comment.content.replace(/ <small>\(OP\)<\/small> /g, '')
	}

	return comment
}

function parseAuthorName(authorName, { defaultAuthorName }) {
	if (authorName === defaultAuthorName) {
		return
	}
	return authorName
}
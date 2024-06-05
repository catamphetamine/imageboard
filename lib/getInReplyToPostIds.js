import parsePostLinkUrlsInContentMarkup from './parsePostLinkUrlsInContentMarkup.js'

import { visitContentParts } from 'social-components/content'

export default function getInReplyToPostIds(post, {
	boardId,
	threadId,
	commentUrlParser,
	parseContent
}) {
	if (post.content) {
		if (parseContent === false) {
			return getInReplyToPostIdsForRawContent(post.content, {
				boardId,
				threadId,
				commentUrlParser
			})
		} else {
			return getInReplyToPostIdsForParsedContent(post.content, {
				boardId,
				threadId
			})
		}
	}
}

function getInReplyToPostIdsForRawContent(rawContent, {
	boardId,
	threadId,
	commentUrlParser
}) {
	const linkMetas = parsePostLinkUrlsInContentMarkup(rawContent, { commentUrlParser })
		.filter((linkMeta) => {
			return !linkMeta.boardId && !linkMeta.threadId ||
				(linkMeta.boardId === boardId) && (linkMeta.threadId === threadId)
		})
	if (linkMetas.length > 0) {
		const commentIds = linkMetas.map(linkMeta => linkMeta.commentId)
		// Exclude duplicates.
		// Sometimes users add multiple post links to the same post
		// in their comments content. For example:
		// ">>12345 >>12345 >>12345"
		return commentIds.filter((commentId, i) => commentIds.indexOf(commentId) === i)
	}
}

function getInReplyToPostIdsForParsedContent(content, {
	boardId,
	threadId
}) {
	let inReplyTo
	visitContentParts(
		'post-link',
		link => {
			// Only add same-thread comment IDs as "quoted" ones.
			if (link.meta.boardId === boardId && link.meta.threadId === threadId) {
				if (!inReplyTo) {
					inReplyTo = []
				}
				// Exclude duplicates.
				if (inReplyTo.indexOf(link.meta.commentId) < 0) {
					inReplyTo.push(link.meta.commentId)
				}
			}
		},
		content
	)
	return inReplyTo
}
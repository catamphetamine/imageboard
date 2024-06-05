import { visitContentParts } from 'social-components/content'

/**
 * Sets `content`, `url`, `threadId` and `boardId`
 * of `{ type: 'post-link' }` objects.
 * @param {any} content — Post `content`
 * @param {object} options
 */
export default function setPostLinkUrls(content, { boardId, threadId, commentUrl, threadUrl }) {
	visitContentParts(
		'post-link',
		postLink => setPostLinkUrl(postLink, { boardId, threadId, commentUrl, threadUrl }),
		content
	)
}

function setPostLinkUrl(postLink, { boardId, threadId, commentUrl, threadUrl }) {
	// Set board ID.
	if (!postLink.meta.boardId) {
		postLink.meta.boardId = boardId
	}
	// Set thread ID.
	if (!postLink.meta.threadId) {
		postLink.meta.threadId = threadId
	}
	// Set URL.
	postLink.url = (postLink.meta.commentId === postLink.meta.threadId ? threadUrl : commentUrl)
		.replace('{boardId}', postLink.meta.boardId)
		.replace('{threadId}', postLink.meta.threadId)
		.replace('{commentId}', postLink.meta.commentId)
}
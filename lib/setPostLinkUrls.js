import visitPostParts from 'social-components/utility/post/visitPostParts.js'

/**
 * Sets `content`, `url`, `threadId` and `boardId`
 * of `{ type: 'post-link' }` objects.
 * @param {any} content — Post `content`
 * @param {object} options
 */
export default function setPostLinkUrls(content, { boardId, threadId, commentUrl, threadUrl }) {
	visitPostParts(
		'post-link',
		postLink => setPostLinkUrl(postLink, { boardId, threadId, commentUrl, threadUrl }),
		content
	)
}

function setPostLinkUrl(postLink, { boardId, threadId, commentUrl, threadUrl }) {
	// Set board ID.
	if (!postLink.boardId) {
		postLink.boardId = boardId
	}
	// Set thread ID.
	if (!postLink.threadId) {
		postLink.threadId = threadId
	}
	// Set URL.
	postLink.url = (postLink.postId === postLink.threadId ? threadUrl : commentUrl)
		.replace('{boardId}', postLink.boardId)
		.replace('{threadId}', postLink.threadId)
		.replace('{commentId}', postLink.postId)
}
import visitPostParts from 'social-components/commonjs/utility/post/visitPostParts'

/**
 * Sets `content` for `{ type: 'post-link' }` parts.
 * For example, if a linked post was deleted then `content`
 * is set to "Deleted message" and if the message is hidden
 * then `content` is set to "Hidden message".
 * @param {any} content — Post `content`
 * @param {func} getPostById
 * @param {object} options — `{ messages, threadId }`.
 * @return {boolean} [contentDidChange] — Returns `true` if any "Deleted message"/"Hidden message" link text was set.
 */
export default function setPostLinksContent(content, getPostById, { messages, threadId }) {
	const results = visitPostParts(
		'post-link',
		postLink => postLink.content = getPostLinkContent(postLink, getPostById, { messages, threadId }),
		content
	)
	return results.length > 0
}

function getPostLinkContent(postLink, getPostById, { messages, threadId }) {
	// Get the post being quoted.
	// `Array.find()` is slow for doing it every time.
	// A "postsById" index is much faster.
	const quotedPost = getPostById(postLink.postId)
	// If it's a post link for a post from another thread then mark it as such.
	// else if (postLink.threadId && postLink.threadId !== threadId) {
	if (postLink.threadId !== threadId) {
		postLink.postIsExternal = true
		if (messages && messages.comment && messages.comment.external) {
			return messages.comment.external
		}
	}
	// If the quoted post has been deleted then skip it.
	else if (!quotedPost) {
		postLink.postWasDeleted = true
		if (messages && messages.comment && messages.comment.deleted) {
			return messages.comment.deleted
		}
	}
	// If the quoted post is hidden then don't add a quote it a link to it.
	else if (quotedPost.hidden) {
		postLink.postIsHidden = true
		postLink.postIsHiddenRule = quotedPost.hiddenRule
		if (messages && messages.comment && messages.comment.hidden) {
			if (postLink.postIsHiddenRule) {
				return `${messages.comment.hidden} (${postLink.postIsHiddenRule})`
			}
			return messages.comment.hidden
		}
	}
	else {
		if (messages && messages.comment && messages.comment.default) {
			return messages.comment.default
		}
	}
	// No change.
	return postLink.content
}
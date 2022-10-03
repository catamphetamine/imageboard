import visitPostParts from 'social-components/utility/post/visitPostParts.js'

/**
 * Classifies `post-link`s: whether they're `post-link`s to
 * hidden, deleted, or existing comments. Whether they link to
 * comments from other threads or to other threads themselves.
 * @param {any} content — Post `content`
 * @param {func} options.getCommentById
 * @param {number} options.threadId
 */
export default function classifyPostLinks(content, {
	getCommentById,
	threadId,
	markDeletedPosts
}) {
	visitPostParts(
		'post-link',
		postLink => classifyPostLink(postLink, {
			getCommentById,
			threadId,
			markDeletedPosts
		}),
		content
	)
}

function classifyPostLink(postLink, {
	getCommentById,
	threadId,
	markDeletedPosts
}) {
	// Get the post being quoted.
	// `Array.find()` is slow for doing it every time.
	// A "postsById" index is much faster.
	const quotedPost = getCommentById(postLink.postId)
	// If it's a post link for a post from another thread then mark it as "external".
	if (postLink.threadId !== threadId) {
		postLink.postIsExternal = true
		if (typeof postLink.content === 'string' &&
			OP_POST_LINK_TEXT.test(postLink.content)) {
			postLink.postIsRoot = true
		}
	}
	// If the quoted post has been deleted then skip it.
	else if (!quotedPost) {
		if (markDeletedPosts) {
			postLink.postWasDeleted = true
		}
	}
	// If the quoted post is hidden then don't add a quote it a link to it.
	else if (quotedPost.hidden) {
		postLink.postIsHidden = true
		postLink.postIsHiddenRule = quotedPost.hiddenRule
	}
}

const OP_POST_LINK_TEXT = / \(OP\)$/
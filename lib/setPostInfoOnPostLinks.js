import { visitContentParts } from 'social-components/content'

/**
 * Sets the post info on post links:
 * * Sets the flags on whether they're `post-link`s to deleted comments.
 * * Sets the flags on whether they link to comments from other threads or to other threads themselves.
 * * Sets any optional application-specific `post-link` properties returned from `getPostLinkProperties()`.
 * @param {any} content — Post `content`
 * @param {func} [options.getPostLinkProperties]
 * @param {func} options.getCommentById
 * @param {number} options.threadId
 * @param {boolean} [options.markDeletedPosts]
 */
export default function setPostInfoOnPostLinks(content, {
	getPostLinkProperties,
	getCommentById,
	threadId,
	markDeletedPosts
}) {
	visitContentParts(
		'post-link',
		postLink => classifyPostLink(postLink, {
			getPostLinkProperties,
			getCommentById,
			threadId,
			markDeletedPosts
		}),
		content
	)
}

function classifyPostLink(postLink, {
	getPostLinkProperties,
	getCommentById,
	threadId,
	markDeletedPosts
}) {
	// Get the post being linked to.
	// `Array.find()` is slow for doing it every time.
	// A "postsById" index is much faster.
	const linkedPost = getCommentById(postLink.meta.commentId)

	// Set `isAnotherThread` flag if it's a post link to a post from another thread.
	if (postLink.meta.threadId !== threadId) {
		postLink.meta.isAnotherThread = true
	}

	// // Set flag `isMainComment` flag if the linked post is the "original post" of its thread.
	// if (typeof postLink.content === 'string' && OP_POST_LINK_TEXT.test(postLink.content)) {
	// 	postLink.meta.isMainComment = true
	// }

	// If the linked post has been deleted then set `isDeleted` flag.
	if (!postLink.meta.isAnotherThread && !linkedPost) {
		if (markDeletedPosts) {
			postLink.meta.isDeleted = true
		}
	}

	// Set any application-specific `post-link` properties.
	if (getPostLinkProperties) {
		// If the linked post wasn't deleted.
		if (linkedPost) {
			const postLinkProperties = getPostLinkProperties(linkedPost)
			for (const key of Object.keys(postLinkProperties)) {
				postLink[key] = postLinkProperties[key]
			}
		}
	}
}

const OP_POST_LINK_TEXT = / \(OP\)$/
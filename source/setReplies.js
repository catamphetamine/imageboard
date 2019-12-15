import createByIdIndex from './utility/createByIdIndex'

/**
 * For each post sets `post.replies` to
 * the list of reply ids to this post.
 * Doesn't set it to an array of post objects
 * to prevent JSON circular structure.
 * Sets just post ids instead.
 * @param {object[]} posts — Parsed posts.
 * @param {boolean} expandReplies — Pass `true` to expand `replies` array from a list of reply `id`s to a list of the reply objects.
 */
export default function setReplies(posts, expandReplies) {
	// Create "posts by id" index for optimized performance.
	const getPostById = createByIdIndex(posts)
	for (const post of posts) {
		if (post.inReplyTo) {
			for (let inReplyToPost of post.inReplyTo) {
				// `inReplyTo` is an array of posts if `expandAttachments` is `true`.
				if (!expandReplies) {
					// Using `postsById` index is much faster than array lookup.
					// const inReplyToPost = posts.find(_ => _.id === postId)
					inReplyToPost = getPostById(inReplyToPost)
				}
				inReplyToPost.replies = inReplyToPost.replies || []
				// Doesn't set it to an array of post objects
				// to prevent JSON circular structure.
				// Sets just post ids instead.
				inReplyToPost.replies.push(expandReplies ? post : post.id)
			}
		}
	}
}
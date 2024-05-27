import createByIdIndex from './utility/createByIdIndex.js'

/**
 * For each `post` having replies, creates a `post.replies[]` property
 * with the list of replies to this `post`
 * (either their `ids` or the actual `Post` objects).
 * The reply info is looked up from `post.inReplyTo[]` property.
 * The `expandReplies` parameter controls whether the `.replies[]` list
 * is gonna contain just the replying post ids or the posts themselves.
 * The default behavior is the `.replies[]` list just containing replying
 * post ids in order to prevent the `post` object from turning into a
 * circular JSON structure when it can't be tested via `deepEqual()` in tests.
 * @param {object[]} posts — Parsed posts.
 * @param {boolean} expandReplies — Pass `true` in order for the created `.replies[]` list to contain the replies themselves rather than just their ids.
 */
export default function setReplies(posts, { expandReplies }) {
	// Create "posts by id" index for optimized performance.
	const getPostById = createByIdIndex(posts)
	for (const post of posts) {
		if (post.inReplyToIds) {
			for (const inReplyToPostId of post.inReplyToIds) {
				// Using `postsById` index is much faster than array lookup.
				// const inReplyToPost = posts.find(_ => _.id === inReplyToPostId)
				const inReplyToPost = getPostById(inReplyToPostId)
				// If `inReplyToPost` has been deleted by a moderator
				// then its ID is not present in `post.inReplyToIds`.
				// Still, added this `if` just in case anyone changes anything in some future.
				if (!inReplyToPost) {
					console.warn(`[imageboard] Post #${inReplyToPostId} not found when populating \`replyIds\``)
					continue
				}
				inReplyToPost.replyIds = inReplyToPost.replyIds || []
				inReplyToPost.replyIds.push(post.id)
				if (expandReplies) {
					inReplyToPost.replies = inReplyToPost.replies || []
					inReplyToPost.replies.push(post)
				}
			}
		}
	}
}
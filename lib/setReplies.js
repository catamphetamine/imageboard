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
		if (post.inReplyTo) {
			for (let inReplyToPost of post.inReplyTo) {
				// `inReplyTo` is an array of posts if `expandReplies` is `true`.
				if (!expandReplies) {
					// Using `postsById` index is much faster than array lookup.
					// const inReplyToPost = posts.find(_ => _.id === postId)
					inReplyToPost = getPostById(inReplyToPost)
					// If the quoted post has been deleted by a moderator,
					// then it has also been removed from `.inReplyTo[]` in
					// `source/Thread.js`, so, at this point, `inReplyToPost`
					// does exist.
				}
				inReplyToPost.replies = inReplyToPost.replies || []
				// Doesn't set it to an array of post objects
				// to prevent JSON circular structure.
				// Sets just post IDs instead.
				inReplyToPost.replies.push(expandReplies ? post : post.id)
			}
		}
	}
}
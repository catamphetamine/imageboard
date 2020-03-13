import getBoardInfo from '../board/getBoardInfo'

/**
 * Parses "get thread comments" API response.
 * @param  {object} response — "get thread comments" API response.
 * @return {object} `{ board, thread, comments }`.
 */
export default function parseThreadResponse(response) {
	const {
		current_thread,
		posts_count,
		files_count,
		unique_posters
	} = response
	const openingPost = response.threads[0].posts[0]
	const thread = {
		id: parseInt(current_thread),
		commentsCount: posts_count,
		// `unique_posters` is only present in "get thread comments" API response.
		// For some weird reason doesn't include the "opening comment" of a thread.
		// In other words, `unique_posters` won't count thread author unless
		// they've posted a comment in their own thread.
		uniquePostersCount: parseInt(unique_posters),
		// `files_count` includes the "opening comment"'s attachments in this case.
		// `files_count` is incorrect anyway:
		// https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/makaba-issues.md
		attachmentsCount: files_count,
		isLocked: openingPost.closed === 1,
		isRolling: openingPost.endless === 1,
		// If the thread is pinned `sticky` will be a number greater than `0`.
		isSticky: openingPost.sticky > 0,
		updatedAt: new Date(openingPost.lasthit * 1000)
	}
	// If there're no `tags` then it's an empty string.
	if (openingPost.tags) {
		thread.tags = [openingPost.tags]
	}
	return {
		board: getBoardInfo(response),
		comments: response.threads[0].posts,
		thread
	}
}
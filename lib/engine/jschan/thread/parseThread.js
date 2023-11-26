export default function parseThread(_thread) {
	const {
		// * "get thread" API — `replies` is a non-`undefined` array of replies.
		// * "get threads" API — `replies` is `undefined`.
		replies,
		cyclic,
		locked,
		bumplocked,
		sticky,
		bumped,
		tags,
		replyposts,
		replyfiles,
		...rootPost
	} = _thread

	const thread = {
		id: rootPost.postId,
		// The `boardId` will be overwritten anyway:
		// boardId: rootPost.board,

		// `bumped` is not necessarily the latest comment date.
		// It's a date of when the thread was latest "bumped",
		// i.e. received a comment which is not a "sage" one
		// and the thread is neither bumplocked nor has reached bumplimit.
		// updatedAt: new Date(bumped),

		comments: [rootPost].concat(replies || []),
		commentsCount: replyposts + 1,
		attachmentsCount: replyfiles + rootPost.files.length,
		commentAttachmentsCount: replyfiles
	}

	if (locked === 1) {
		thread.locked = true
	}

	// If the thread is pinned `sticky` will be a number greater than `0`.
	if (sticky > 0) {
		thread.pinned = true
		// The value of `sticky` is a "priority", which is (supposedly) an inverse of "order".
		// Convert "priority" to "order".
		// Assumes there can't be more than a 1000 sticky threads in a channel.
		thread.pinnedOrder = 1000 - sticky
	}

	// "Trimming" threads never go into "bump limit":
	// instead messages are being shifted from the start of
	// such thread as new messages are posted to it.
	// The "opening post" is always preserved.
	if (cyclic === 1) {
		thread.trimming = true
	}

	// "bumplocked" threads never get bumped, even when someone leaves a comment.
	if (bumplocked === 1) {
		thread.bumpLimitReached = true
	}

	// `tags` seems to be a single tag name. Example: "fighting".
	// If there're no tags then `tags` is an empty string.
	if (tags) {
		thread.tags = [tags]
	}

	return thread
}
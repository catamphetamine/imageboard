export default function sortThreadsByMostRecentComment(threads) {
	return threads.sort((a, b) => {
		const aLatestComment = getLatestComment(a)
		const bLatestComment = getLatestComment(b)
		// If `b`'s reply was created after `a`'s reply
		// then `b` will go before `a` in the list.
		if (aLatestComment.createdAt && bLatestComment.createdAt) {
			return bLatestComment.createdAt.getTime() - aLatestComment.createdAt.getTime()
		}
		// If some (but not both) of the threads' latest replies have no `createdAt` property
		// then place such threads at the bottom of the list.
		if (aLatestComment.createdAt && !bLatestComment.createdAt) {
			// `b` goes below `a`.
			return -1
		}
		if (bLatestComment.createdAt && !aLatestComment.createdAt) {
			// `a` goes below `b`.
			return 1
		}
		// Both of the threads' latest replies have no `createdAt` property.
		// The order is not determined, so just sort by ID so that the algorithm is deterministic.
		// In that case, a thread with a higher `id` will be higher in the list.
		// Also, if thread IDs are sequential then higher `thread.id` means higher `thread.createdAt`.
		return b.id - a.id
	})
}

function getLatestComment(thread) {
	if (thread.latestComments) {
		return thread.latestComments[thread.latestComments.length - 1]
	}
	return thread.comments[thread.comments.length - 1]
}
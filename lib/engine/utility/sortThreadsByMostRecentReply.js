export default function sortThreadsByMostRecentReply(threads) {
	return threads.sort((a, b) => {
		const aLatestReply = a.comments[a.comments.length - 1]
		const bLatestReply = b.comments[b.comments.length - 1]
		// If `b`'s reply was created after `a`'s reply
		// then `b` will go before `a` in the list.
		if (aLatestReply.createdAt && bLatestReply.createdAt) {
			return bLatestReply.createdAt.getTime() - aLatestReply.createdAt.getTime()
		}
		// If some (but not both) of the threads' latest replies have no `createdAt` property
		// then place such threads at the bottom of the list.
		if (aLatestReply.createdAt && !bLatestReply.createdAt) {
			// `b` goes below `a`.
			return -1
		}
		if (bLatestReply.createdAt && !aLatestReply.createdAt) {
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
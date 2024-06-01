export default function sortThreadsByMostRecentlyCreated(threads) {
	return threads.sort((a, b) => {
		if (a.createdAt && b.createdAt) {
			// If `b` was created after `a`
			// then `b` will go before `a` in the list.
			return b.createdAt.getTime() - a.createdAt.getTime()
		}
		// If some (but not both) of the threads have no `cratedAt` property
		// then place such threads at the bottom of the list.
		if (a.createdAt && !b.createdAt) {
			// `b` goes below `a`.
			return -1
		}
		if (b.createdAt && !a.createdAt) {
			// `a` goes below `b`.
			return 1
		}
		// Both of the threads have no `cratedAt` property.
		// The order is not determined, so just sort by ID so that the algorithm is deterministic.
		// In that case, a thread with a higher `id` will be higher in the list.
		// Also, if thread IDs are sequential then higher `thread.id` means higher `thread.createdAt`.
		return b.id - a.id
	})
}
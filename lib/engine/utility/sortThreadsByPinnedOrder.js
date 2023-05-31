// Places `pinned` threads on top, according to their `pinnedOrder`.
// Lower `pinnedOrder` means higher in the list.
export default function sortThreadsByPinnedOrder(threads) {
	return threads.sort((a, b) => {
		if (a.pinned && b.pinned) {
			if (!isNaN(a.pinnedOrder) && !isNaN(b.pinnedOrder)) {
				return a.pinnedOrder - b.pinnedOrder
			}
			return threads.indexOf(a) - threads.indexOf(b)
		}
		if (a.pinned && !b.pinned) {
			return -1
		}
		if (!a.pinned && b.pinned) {
			return 1
		}
		// Neither of the threads are pinned.
		// The order is not determined, so just leave the threads' positions as is.
		return 0
	})
}
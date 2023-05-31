export default function sortThreadsById(threads) {
	return threads.sort((a, b) => {
		// The order is not determined.
		// If thread IDs are sequential,
		// if `b` was created after `a`
		// then `b.id` will be larger than `a.id`
		// and `b` will go before `a` in the list.
		return b.id - a.id
	})
}
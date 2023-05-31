import calculateThreadRating from './calculateThreadRating.js'

// In `makaba` engine, thread stats doesn't include "pinned" threads.
// Also, "thread stats" response may be missing some of the threads
// due to "race conditions" since getting the full threads list
// and getting thread stats are two separate HTTP requests, not one.
// So it also handles the case when a thread's rating is `undefined`.
export default function getThreadRating(thread, { threadsStats }) {
	if (threadsStats) {
		const threadStats = threadsStats[String(thread.id)]
		// In `makaba` engine, if a thread is missing from threads stats, then it means that
		// either the thread is "pinned" or the thread has just been created.
		// Set its `rating` to a dummy value `-1`.
		if (threadStats === undefined) {
			// If a `rating` is a number `>= 0` then threads rated at `-1` go at the bottom of the list.
			return -1
		}
		return threadStats.rating
	} else {
		return calculateThreadRating(thread)
	}
}
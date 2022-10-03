/**
 * Returns a function that can be used to sort threads by rating.
 * @param  {object} [_threadsStats] — Threads stats index, each "stat" being an object having a `rating: number` property.
 * @return {function} A function of `threads`.
 */
export function getSortThreadsByRating(_threadsStats) {
	return (threads) => {
		let threadsStats = _threadsStats
		if (!threadsStats) {
			threadsStats = {}
			for (const thread of threads) {
				threadsStats[thread.id] = {
					rating: calculateThreadRating(thread)
				}
			}
		}
		// In `makaba` engine, thread stats doesn't include "pinned" threads.
		// Also, "thread stats" response may be missing some of the threads
		// due to "race conditions" since getting the full threads list
		// and getting thread stats are two separate HTTP requests, not one.
		// So it also handles the case when a thread's rating is `undefined`.
		function getThreadRating(thread) {
			const threadStats = threadsStats[thread.id]
			if (threadStats === undefined) {
				// If a thread is missing from threads stats, then it means that
				// either the thread is "pinned" or the thread has just been created.
				// If a thread has just been created, then it's rating is `0`
				// because it doesn't have any comments or views yet.
				// If a thread is pinned then it will be shown at the top,
				// regardless of its rating.
				return 0
			}
			return threadStats.rating
		}
		return threads.sort((a, b) => {
			if (a.onTop && b.onTop) {
				if (!isNaN(a.onTopOrder) && !isNaN(b.onTopOrder)) {
					return a.onTopOrder - b.onTopOrder
				}
				return threads.indexOf(a) - threads.indexOf(b)
			}
			if (a.onTop && !b.onTop) {
				return -1
			}
			if (!a.onTop && b.onTop) {
				return 1
			}
			return getThreadRating(b) - getThreadRating(a)
		})
	}
}

/**
 * To get "posts per minute" stats of a thread:
 * (for example, for sorting threads by "popularity")
 *
 * ```
 * postsCount = thread.repliesCount + 1
 * threadLifetimeInMinutes = (currentUnixTimestamp - thread.createdAtUnixTimestamp) / 60
 * postsPerMinute = postsCount / threadLifetimeInMinutes
 * ```
 *
 * That would be an average "posts per minute" stats for a thread
 * across its entire lifespan. It's not completely accurate because
 * it assumes that replies are evenly spread throughout the thread's lifetime.
 *
 * Even though the "posts per minute" stats for a thread is an approximation,
 * it can still be a good-enough indicator of what kind of threads people
 * generally participate in (aka "popular" threads).
 *
 * If a thread is a new one then its "posts per minute" stats is not reliable.
 * For example, if `thread.createdAtUnixTimestamp` is equal to `currentUnixTimestamp`
 * then it's `postsPerMinute` is `Infinity` due to the division by zero.
 * So a thread's lifetime should be assumed at least a minute.
 *
 * Or, for example, if a thread has been created just a minute earlier, then
 * its `postsPerMinute` stats is `1` and it will be moved to the top of the rating
 * on a "slow" board just because other threads only usually get something like
 * a single comment in an hour.
 *
 * So a rating of a thread should account for two metrics:
 * the "posts per minute" stats and the total posts count in the thread.
 *
 * @param {Thread} thread
 * @return {number} Rating
 */
function calculateThreadRating(thread) {
	let threadLifetime = Date.now() - thread.createdAt.getTime()
	// The server time can be off due to misconfiguration.
	if (threadLifetime < 0) {
		threadLifetime = 0
	}
	let threadLifetimeInMinutes = (threadLifetime / 1000) / 60
	// If a thread is a new one then its "posts per minute" stats is not reliable.
	// For example, if `thread.createdAtUnixTimestamp` is equal to `currentUnixTimestamp`
	// then it's `postsPerMinute` is `Infinity` due to the division by zero.
	// So a thread's lifetime should be assumed at least a minute.
	if (threadLifetimeInMinutes < 1) {
		threadLifetimeInMinutes = 1
	}
	const postsPerMinute = thread.commentsCount / threadLifetimeInMinutes
	switch (thread.commentsCount) {
		case 1:
			return 0
		case 2:
			return 0.01 * postsPerMinute
		case 3:
			return 0.05 * postsPerMinute
		case 4:
			return 0.1 * postsPerMinute
		case 5:
			return 0.3 * postsPerMinute
		case 6:
			return 0.5 * postsPerMinute
		case 7:
			return 0.7 * postsPerMinute
		case 8:
			return 0.8 * postsPerMinute
		case 9:
			return 0.9 * postsPerMinute
		default:
			return postsPerMinute
	}
}

export function sortThreadsByMostRecentReply(threads) {
	return threads.sort((a, b) => {
		const aLatestReply = a.comments[a.comments.length - 1]
		const bLatestReply = b.comments[b.comments.length - 1]
		// If `b`'s reply was created after `a`'s reply
		// then `b` will go before `a` in the list.
		return bLatestReply.createdAt.getTime() - aLatestReply.createdAt.getTime()
	})
}

export function sortThreadsByMostRecentlyCreated(threads) {
	return threads.sort((a, b) => {
		// If `b` was created after `a`
		// then `b` will go before `a` in the list.
		return b.createdAt.getTime() - a.createdAt.getTime()
	})
}
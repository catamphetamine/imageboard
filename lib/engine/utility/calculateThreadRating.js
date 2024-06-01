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
export default function calculateThreadRating(thread) {
	if (!thread.createdAt) {
		return 0
	}
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
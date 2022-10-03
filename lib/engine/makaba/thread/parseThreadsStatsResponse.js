import parseThread from './parseThread.js'

/**
 * Parses "get threads list" with stats API response.
 * @param  {object} response — "get threads list" with stats API response.
 * @return {object}
 */
export default function parseThreadsStatsResponse(response) {
	// The `/threads.json` API response doesn't contain "pinned" threads.
	// It's obvious that it wouldn't make sense to calculate `score` for "pinned" threads,
	// but it also means that just fetching `/threads.json` is not enough
	// to get the full list of threads, and a developer would have to also
	// fetch `/catalog.json` anyway.
	return response.threads.reduce((all, thread) => {
		// Since fetching `/catalog.json` is required anyway,
		// don't parse threads. Just parse their rating.
		// const parsedThread = parseThread(thread, thread)
		// // `score` is an opaque floating-point number (`>= 0`).
		// parsedThread.rating = thread.score
		// parsedThread.views = thread.views
		// return parsedThread
		all[thread.num] = {
			rating: thread.rating,
			views: thread.views
		}
		return all
	}, {})
}
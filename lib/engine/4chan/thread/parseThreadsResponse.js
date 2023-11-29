import parseThread from './parseThread.js'

/**
 * Parses "get threads list" API response.
 * @param  {object} response — "get threads list" API response.
 * @return {object} `{ threads }`
 */
export default function parseThreadsResponse(response, { withLatestComments }) {
	// `page.threads || []` works around a `8ch.net` issue:
	// When there're no threads on a board, the `catalog.json`
	// doesn't have any `threads` property: `[{"page":0}]`.
	const threadsData = response.reduce((all, page) => all.concat(page.threads || []), [])

	return {
		threads: threadsData.map((threadData) => {
			const thread = parseThread(threadData)
			// On `4chan` there're `last_replies` in `/catalog.json` API response.
			// They will be ignored when `withLatestComments` flag is not `true`.
			if (withLatestComments) {
				// `last_replies` property is supposed to always be present in `/catalog.json` API response.
				// Still, added an `if (last_replies)` just in case they change anything in their API in some future.
				if (threadData.last_replies) {
					thread.comments = thread.comments.concat(threadData.last_replies)
				}
			}
			return thread
		})
	}
}
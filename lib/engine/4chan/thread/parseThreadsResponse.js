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
	const threads = response.reduce((all, page) => all.concat(page.threads || []), [])
	return {
		threads: threads.map((thread) => parseThread(thread, {
			// On `4chan` there're `last_replies` in `/catalog.json` API response.
			last_replies: withLatestComments ? thread.last_replies : undefined
		}))
	}
}
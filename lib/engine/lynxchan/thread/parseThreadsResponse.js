import parseThread from './parseThread.js'

/**
 * Parses "get threads list" API response.
 * @param  {object} response — "get threads list" API response.
 * @return {object} `{ threads }`
 */
export default function parseThreadsResponse(response) {
	return {
		threads: response.map(thread => parseThread(thread, { mode: 'catalog' }))
	}
}
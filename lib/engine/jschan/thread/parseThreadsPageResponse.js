import throwErrorForErrorResponse from '../throwErrorForErrorResponse.js'

import parseThread from './parseThread.js'

/**
 * Parses "get threads list" page API response.
 * @param  {object} response — "get threads list" page API response.
 * @return {object} `{ threads }`
 */
export default function parseThreadsPageResponse(response, { status }) {
	throwErrorForErrorResponse(response, { status })

	return {
		threads: response.map((thread) => {
			return parseThread(thread)
		})
	}
}
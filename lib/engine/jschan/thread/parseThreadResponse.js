import throwErrorForErrorResponse from '../throwErrorForErrorResponse.js'

import parseThread from './parseThread.js'

/**
 * Parses "get thread comments" API response.
 * @param  {object} response — "get thread comments" API response.
 * @return {object} `{ thread }`
 */
export default function parseThreadResponse(response, { status }) {
	throwErrorForErrorResponse(response, { status })

	const thread = parseThread(response)
	return {
		thread
	}
}
import parseThread from './parseThread.js'
import parseBoard from '../board/parseBoard.js'

/**
 * Parses "get thread comments" API response.
 * @param  {object} response — "get thread comments" API response.
 * @return {object} `{ thread, board }`
 */
export default function parseThreadResponse(response, options) {
	return {
		thread: parseThread(response, { mode: 'thread' }),
		board: parseBoard(response)
	}
}
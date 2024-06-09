import parseBoard from '../board/parseBoard.js'
import parseThread from './parseThread.js'

/**
 * Parses "get threads list" API response.
 * @param  {object} response — "get threads list" API response.
 * @return {object} `{ board, threads }`.
 */
export default function parseThreadsResponse(response, options) {
	const board = parseBoard(response.board, options)

	return {
		board,
		threads: response.threads.map(thread => parseThread(thread, thread))
	}
}
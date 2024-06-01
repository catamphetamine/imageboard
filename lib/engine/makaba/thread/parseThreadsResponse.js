import getBoardInfo from '../board/getBoardInfo.js'
import parseThread from './parseThread.js'

/**
 * Parses "get threads list" API response.
 * @param  {object} response — "get threads list" API response.
 * @return {object} `{ board, threads }`.
 */
export default function parseThreadsResponse(response) {
	return {
		board: getBoardInfo(response.board),
		threads: response.threads.map(thread => parseThread(thread, thread))
	}
}
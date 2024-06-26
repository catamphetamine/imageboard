import parseBoard from '../board/parseBoard.js'
import parseThread from './parseThread.js'

/**
 * Parses "get threads list" page API response.
 * @param  {object} response — "get threads list" page API response.
 * @return {object} `{ pageCount, board, threads }`
 */
export default function parseThreadsPageResponse(response, { boardId, withLatestComments }) {
	return {
		pageCount: response.pageCount,
		board: parseBoard(response, { boardId }),
		threads: response.threads.map((threadData) => {
			const thread = parseThread(threadData, { mode: 'threads-page' })
			if (withLatestComments) {
				thread.comments = thread.comments.concat(threadData.posts)
			}
			return thread
		})
	}
}
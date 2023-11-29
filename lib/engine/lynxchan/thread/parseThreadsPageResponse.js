import getBoardInfo from '../board/getBoardInfo.js'
import parseThread from './parseThread.js'

/**
 * Parses "get threads list" page API response.
 * @param  {object} response — "get threads list" page API response.
 * @return {object} `{ pageCount, board, threads }`
 */
export default function parseThreadsPageResponse(response, { withLatestComments }) {
	return {
		pageCount: response.pageCount,
		board: getBoardInfo(response),
		threads: response.threads.map((threadData) => {
			const thread = parseThread(threadData, { mode: 'threads-page' })
			if (withLatestComments) {
				thread.comments = thread.comments.concat(threadData.posts)
			}
			return thread
		})
	}
}
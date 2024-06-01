import getBoardInfo from '../board/getBoardInfo.js'
import parseThread from './parseThread.js'

/**
 * Parses "get threads list" page API response.
 * @param  {object} response — "get threads list" page API response.
 * @return {object} `{ pageCount, board, threads }`.
 */
export default function parseThreadsPageResponse(response, { withLatestComments }) {
	return {
		// page: response.current_page + 1,
		pageCount: response.pages.length,
		board: getBoardInfo(response.board),
		threads: response.threads.map((threadData) => {
			const thread = parseThread(threadData.posts[0], threadData, { fromPaginatedThreadsList: true })
			if (withLatestComments) {
				thread.comments = thread.comments.concat(threadData.posts.slice(1))
			}
			return thread
		})
	}
}
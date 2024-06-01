import parseThread from './parseThread.js'

/**
 * Parses "get threads list" page API response.
 * @param  {object} response — "get threads list" page API response.
 * @return {object} `{ threads }`
 */
export default function parseThreadsPageResponse(response, { withLatestComments }) {
	return {
		threads: response.threads.map((threadData) => {
			const thread = parseThread(threadData.posts[0])
			if (withLatestComments) {
				thread.comments = thread.comments.concat(threadData.posts.slice(1))
			}
			return thread
		})
	}
}
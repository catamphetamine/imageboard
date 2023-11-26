import parseThread from './parseThread.js'

/**
 * Parses "get threads list" page API response.
 * @param  {object} response — "get threads list" page API response.
 * @return {object} `{ threads }`
 */
export default function parseThreadsPageResponse(response) {
	return {
		threads: response.threads.map((thread) => {
			// Moving all non-main comments to `latestComments` array
			// had in `lib/engine/getThreads.js` instead of here because if it was done here,
			// `inReplyTo[]`/`replies[]` arrays wouldn't be set correctly
			// in cases when some of the `latestComments` are replies to the main comment:
			// in that case, the code would process `thread.comments` and `thread.latestComments`
			// separately and wouldn't link them to one another.

			// const _thread = parseThread(thread.posts[0])
			// _thread.latestComments = thread.posts.slice(1)
			// return _thread

			const _thread = parseThread(thread.posts[0])
			_thread.comments = _thread.comments.concat(thread.posts.slice(1))
			return _thread
		})
	}
}
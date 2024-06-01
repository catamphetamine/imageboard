import parseThread from './parseThread.js'

/**
 * Parses "get thread comments" API response.
 * @param  {object} response — "get thread comments" API response.
 * @return {object} `{ thread }`
 */
export default function parseThreadResponse(response) {
	const thread = parseThread(response.posts[0])
	// If the thread data came from the "-tail" API,
	// set `afterCommentId` property on the `thread` object.
	if (response.posts[0].tail_id) {
		thread.afterCommentId = response.posts[0].tail_id
	}
	thread.comments = thread.comments.concat(response.posts.slice(1))
	return {
		thread
	}
}
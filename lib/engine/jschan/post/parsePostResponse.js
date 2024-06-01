import throwErrorForErrorResponse from '../throwErrorForErrorResponse.js'

export default function parsePostResponse(response, { status }) {
	throwErrorForErrorResponse(response, { status })

	if (response.postId) {
		// Posted a new comment.
		// Returns the ID of the new comment.
		return {
			id: response.postId
		}
	}

	if (response.thread) {
		// Posted a new thread.
		// Returns the ID of the new thread.
		return {
			id: response.thread
		}
	}

	throw new Error('Unsupported response: ' + JSON.stringify(response))
}
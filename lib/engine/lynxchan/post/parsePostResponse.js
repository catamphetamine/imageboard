import throwErrorForErrorResponse from '../throwErrorForErrorResponse.js'

export default function parsePostResponse(response) {
	throwErrorForErrorResponse(response)

	// Returns comment ID for "create comment" action or thread ID for "create thread" action.
	return response
}
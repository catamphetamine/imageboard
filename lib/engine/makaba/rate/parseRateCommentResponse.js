import throwErrorForErrorResponse from '../throwErrorForErrorResponse.js'

/**
 * Parses "rate" API response.
 * @param  {object} response
 * @return {boolean} Returns `true` if the vote has been accepted. Returns `false` if the user has already voted for this thread or comment.
 */
export default function parseRateCommentResponse(response) {
	try {
		throwErrorForErrorResponse(response)
	} catch (error) {
		// If the user has already voted for the comment, return `false`.
		if (error.code === -4) {
			return false
		}
		throw error
	}

	return true
}
/**
 * Parses "vote" API response.
 * @param  {object} response
 * @return {boolean} Returns `true` if the vote has been accepted. Returns `false` if the user has already voted for this thread or comment.
 */
export default function parseVoteResponse(response) {
	if (response.result === 1) {
		return true
	}
	if (response.error) {
		// If the user has already voted for the comment.
		if (response.error.code === -4) {
			return false
		}
		throw new Error(response.error.code + ': ' + response.error.message)
	}
	throw new Error('Unsupported response: ' + JSON.stringify(response))
}
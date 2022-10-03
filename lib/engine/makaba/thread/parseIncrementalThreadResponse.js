export default function parseIncrementalThreadResponse(response, {
	afterCommentId
}) {
	// Check for errors.
	if (response.result !== 1) {
		if (response.error) {
			throw new Error(response.error.code + ': ' + response.error.message)
		}
		throw new Error('Unsupported response: ' + JSON.stringify(response))
	}

	// Check the first returned comment ID.
	const fromCommentId = response.posts[0].id
	// If nothing was deleted then use the incremental data the response.
	if (fromCommentId === afterCommentId) {
		// Remove the first comment because it's already known.
		response.posts.shift()
		// Use the incremental data from the response.
		return {
			unique_posters: response.unique_posters,
			threads: [{
				posts: response.posts
			}]
		}
	}
}
export default function parseIncrementalThreadResponse(response, {
	afterCommentId
}) {
	// `tail_id` is the `id` of the comment that comes before the first comment of the "tail".
	// In other words, `tail_id` is the `id` of the last comment not included in the response.
	const { tail_id } = response.posts[0]
	// If the tail is long enough, then use it.
	if (tail_id <= afterCommentId) {
		return response
	}
}
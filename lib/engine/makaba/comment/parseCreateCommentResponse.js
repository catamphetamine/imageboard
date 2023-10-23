import parsePostResponse from '../post/parsePostResponse.js'

export default function parseCreateCommentResponse(response) {
	return parsePostResponse(response)
}
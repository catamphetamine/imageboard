import parsePostResponse from './parsePostResponse.js'

export default function parseCreateCommentResponse(response) {
	return parsePostResponse(response)
}
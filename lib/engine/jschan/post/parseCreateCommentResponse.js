import parsePostResponse from './parsePostResponse.js'

export default function parseCreateCommentResponse(response, options) {
	return parsePostResponse(response, options)
}
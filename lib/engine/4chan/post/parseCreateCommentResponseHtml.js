import parsePostResponseHtml from './parsePostResponseHtml.js'

export default function parseCreateCommentResponse(response) {
	return parsePostResponseHtml(response)
}
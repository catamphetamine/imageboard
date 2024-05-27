import parsePostResponseHtml from './parsePostResponseHtml.js'

export default function parseCreateThreadResponse(response) {
	return parsePostResponseHtml(response)
}
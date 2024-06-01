import parsePostResponseHtml from './parsePostResponseHtml.js'
import parsePostResponseJson from './parsePostResponseJson.js'

export default function parsePostResponse(response) {
	if (typeof response === 'string') {
		return parsePostResponseHtml(response)
	} else {
		return parsePostResponseJson(response)
	}
}
import parsePostResponse from '../post/parsePostResponse.js'

export default function parseCreateThreadResponse(response) {
	return parsePostResponse(response)
}
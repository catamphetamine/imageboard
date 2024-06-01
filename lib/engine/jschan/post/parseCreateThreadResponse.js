import parsePostResponse from './parsePostResponse.js'

export default function parseCreateThreadResponse(response, options) {
	return parsePostResponse(response, options)
}
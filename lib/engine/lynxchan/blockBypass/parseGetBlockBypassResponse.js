import throwErrorForErrorResponse from '../throwErrorForErrorResponse.js'

export default function parseGetBlockBypassResponse(response) {
	throwErrorForErrorResponse(response)

	// Dunno. Didn't test.
	return response.data
}
import throwErrorForErrorResponse from '../throwErrorForErrorResponse.js'

export default function parseGetBlockBypassResponse(response) {
	throwErrorForErrorResponse(response)

	return response.data
}
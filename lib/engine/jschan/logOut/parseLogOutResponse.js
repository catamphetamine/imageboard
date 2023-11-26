import throwErrorForErrorResponse from '../throwErrorForErrorResponse.js'

export default function parseLogOutResponse(response, { status }) {
	throwErrorForErrorResponse(response, { status })

	return undefined
}
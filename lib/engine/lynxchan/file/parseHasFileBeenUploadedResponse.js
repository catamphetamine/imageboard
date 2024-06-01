import throwErrorForErrorResponse from '../throwErrorForErrorResponse.js'

export default function parseGetCaptchaResponse(response) {
	throwErrorForErrorResponse(response)

	// ? Returns `true` or `false`
	return response
}
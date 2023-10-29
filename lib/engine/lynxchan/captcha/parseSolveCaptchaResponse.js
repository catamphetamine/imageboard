import throwErrorForErrorResponse from '../throwErrorForErrorResponse.js'

export default function parseSolveCaptchaResponse(response) {
	throwErrorForErrorResponse(response)

	// Returns CAPTCHA ID.
	return response.data
}
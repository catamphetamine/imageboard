import throwErrorForErrorResponse from '../throwErrorForErrorResponse.js'

export default function parseLogInResponse(response) {
	throwErrorForErrorResponse(response)

	// Where is the access token? In `set-cookie` header? In response data?
	let accessToken = undefined

	return {
		accessToken
	}
}
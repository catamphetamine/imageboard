import getCookieValue from '../../../utility/getCookieValue.js'
import throwErrorForErrorResponse from '../throwErrorForErrorResponse.js'

export default function parseLogInResponse(response, {
	accessTokenCookieName,
	headers,
	getSetCookieHeaders
}) {
	throwErrorForErrorResponse(response)

	// Where is the access token? In `set-cookie` header? In response data?
	const accessToken = undefined

	// Presumably, there'll be some cookie in the response. Didn't check.
	// const accessToken = getCookieValue(accessTokenCookieName, { headers, getSetCookieHeaders })

	if (!accessToken) {
		throw new Error('ACCESS_TOKEN_COOKIE_MISSING_IN_RESPONSE')
	}

	return {
		accessToken
	}
}
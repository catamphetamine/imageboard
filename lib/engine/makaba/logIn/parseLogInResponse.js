import getCookieValue from '../../../utility/getCookieValue.js'

// `response` is an HTML string.
export default function parseLogInResponse(response, {
	accessTokenCookieName,
	getSetCookieHeaders,
	headers
}) {
	// Returns an `accessToken?: string` property as part of the object
	// if `makaba` sets the auth token cookie.
	const accessToken = getCookieValue(accessTokenCookieName, { headers, getSetCookieHeaders })

	if (!accessToken) {
		throw new Error('ACCESS_TOKEN_COOKIE_MISSING_IN_RESPONSE')
	}

	// Returns a `user` object.
	return {
		accessToken
	}
}
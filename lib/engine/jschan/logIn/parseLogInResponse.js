import throwErrorForErrorResponse from '../throwErrorForErrorResponse.js'
import getCookieValue from '../../../utility/getCookieValue.js'

export default function parseLogInResponse(response, {
	status,
	headers,
	getSetCookieHeaders,
	accessTokenCookieName
}) {
	try {
		throwErrorForErrorResponse(response, { status })
	} catch (error) {
		switch (status) {
			case 403:
				// Maybe analyze the `response` in order to throw "UNAUTHORIZED" error
				// in cases when the user is not authorized to log in, for example, due to being banned.
				throw new Error('INCORRECT_USERNAME_OR_PASSWORD')
			default:
				throw error
		}
	}

	const accessToken = getCookieValue(accessTokenCookieName, { headers, getSetCookieHeaders })

	if (!accessToken) {
		throw new Error('ACCESS_TOKEN_COOKIE_MISSING_IN_RESPONSE')
	}

	return {
		accessToken
	}
}
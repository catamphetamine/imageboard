import getCookie from '../../../utility/getCookie.js'

export default function parseLogInResponse(response, {
	accessTokenCookieName,
	getSetCookieHeaders,
	headers
}) {
	if (response.status === -1) {
		switch (response.message) {
			case 'Your Token must be exactly 10 characters.':
				throw new Error('INVALID_TOKEN')
			case 'Incorrect Token or PIN.':
				throw new Error('TOKEN_NOT_FOUND_OR_INCORRECT_PIN')
			default:
				throw new Error(response.message)
		}
	}

	// Returns an `accessToken?: string` property as part of the object
	// if `4chan` sets the auth token cookie.
	const accessToken = getCookie(accessTokenCookieName, { headers, getSetCookieHeaders })

	// Returns a `user` object.
	return {
		accessToken
	}
}
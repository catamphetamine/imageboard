import getCookieValue from '../../../utility/getCookieValue.js'

export default function parseLogInResponse(response, {
	bannedUrl,
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

	// If a user has received an "individual IP ban",
	// they'll be redirected to `4chan.org/banned` page.
	// It's not clear in which occasions exactly.
	// I'd assume, logging in would be such an occasion.
	if (bannedUrl && headers.get('location') === bannedUrl) {
		throw new Error('BANNED')
	}

	// Returns an `accessToken?: string` property as part of the object
	// if `4chan` sets the auth token cookie.
	const accessToken = getCookieValue(accessTokenCookieName, { headers, getSetCookieHeaders })

	if (!accessToken) {
		throw new Error('ACCESS_TOKEN_COOKIE_MISSING_IN_RESPONSE')
	}

	// Returns a `user` object.
	return {
		accessToken
	}
}
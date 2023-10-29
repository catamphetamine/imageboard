import getCookie from '../../../utility/getCookie.js'

// `response` is an HTML string.
export default function parseLogInResponse(response, {
	accessTokenCookieName,
	setCookieHeaderName,
	headers
}) {
	// Returns an `accessToken?: string` property as part of the object
	// if `makaba` sets the auth token cookie.
	// (Known issue: cookies aren't set for `localhost` domain)
	const accessToken = getCookie(accessTokenCookieName, { headers, setCookieHeaderName })

	// Returns a `user` object.
	return {
		accessToken
	}
}
import { parse as parseSetCookieHeader } from 'set-cookie-parser'

// `response` is an HTML string.
export default function parseLogInResponse(response, { accessTokenCookieName, headers }) {
	// Returns an `accessToken?: string` property as part of the object
	// if `makaba` sets the auth token cookie.
	// (Known issue: cookies aren't set for `localhost` domain)
	let accessToken

	// Reads `response.headers.get('Set-Cookie')` HTTP header
	// and extracts the auth token cookie value from it.
	if (headers) {
		if (accessTokenCookieName) {
			const setCookieHeader = headers.get('Set-Cookie')
			if (setCookieHeader) {
				const cookies = parseSetCookieHeader(setCookieHeader)
				const accessTokenCookie = cookies.find(_ => _.name === accessTokenCookieName)
				if (accessTokenCookie) {
					accessToken = accessTokenCookie.value
				}
			}
		}
	}

	// Returns a `user` object.
	return {
		accessToken
	}
}
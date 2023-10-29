import { parse as parseSetCookieHeader } from 'set-cookie-parser'

export default function getCookie(name, { headers, setCookieHeaderName = 'set-cookie' }) {
	// Reads `response.headers.get('Set-Cookie')` HTTP header
	// and extracts the cookie value from it.
	if (headers) {
		const setCookieHeader = headers.get(setCookieHeaderName)
		if (setCookieHeader) {
			const cookies = parseSetCookieHeader(setCookieHeader)
			const cookie = cookies.find(_ => _.name === name)
			if (cookie) {
				return cookie.value
			}
		}
	}
}
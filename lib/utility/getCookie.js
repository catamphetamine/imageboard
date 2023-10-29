import { parse as parseSetCookieHeaders } from 'set-cookie-parser'

export default function getCookie(name, {
	headers,
	getSetCookieHeaders = getSetCookieHeadersDefault
}) {
	// Reads `response.headers.get('Set-Cookie')` HTTP header
	// and extracts the cookie value from it.
	// `headers` are gonna be present if the developer returns them
	// from their `request()` function.
	if (headers) {
		for (const cookie of parseSetCookieHeaders(getSetCookieHeaders({ headers }))) {
			if (cookie.name === name) {
				return cookie.value
			}
		}
	}
}

function getSetCookieHeadersDefault({ headers }) {
	if (headers) {
		// If the `headers` are from `fetch()`'s `response`, use the `.getSetCookie()` method.
		// https://developer.mozilla.org/en-US/docs/Web/API/Headers/getSetCookie
		if (headers.getSetCookie) {
			return headers.getSetCookie()
		}
		// No `set-cookie` headers.
		return []
	}
}
import { parse as parseSetCookieHeaders } from 'set-cookie-parser'

// https://stackoverflow.com/questions/11526504/minimum-and-maximum-date
const MAX_DATE = new Date(8640000000000000)

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
				return {
					value: cookie.value,
					expiresAt: cookie.expires
				}
			}
		}
	}

	// While Node.js can inspect `Set-Cookie` header of HTTP response,
	// a web browser doesn't have any way of doing that,
	// neither via `response.headers.get('Set-Cookie')`,
	// nor via `response.headers.getSetCookie()`.
	// They say it's for "security" reasons (stupid).
	//
	// A workaround is to look in `document.cookie`
	// after the HTTP response has been handled by the web browser.
	//
	if (typeof document !== 'undefined') {
		if (typeof document.cookie === 'string') {
			const value = getCookieInWebBrowser(name)
			if (value !== undefined) {
				return {
					value,
					// There's no way to get cookie expiration date in a web browser,
					// so it's just set to the maximum possible date in javascript.
					// Effectively it means "doesn't ever expire".
					// If this date is used for things like "tokens" or smth like that,
					// the app will just assume that those tokens are always valid.
					// If a no-longer-valid token gets passed to the server side,
					// the server side will reject it and return a corresponding error code,
					// and that's how the app will understant that it's time to refresh the "token".
					expiresAt: MAX_DATE
				}
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

/**
 * Reads a cookie in a web browser.
 * @param  {string} name
 * @return {string} [value]
 */
export function getCookieInWebBrowser(name) {
	const matches = document.cookie.match(new RegExp(
		"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	))
	return matches ? decodeURIComponent(matches[1]) : undefined
}

import getCookie from '../../../utility/getCookie.js'
import throwErrorForErrorResponse from '../throwErrorForErrorResponse.js'

export default function parseCreateBlockBypassResponse(response, {
	status,
	headers,
	getSetCookieHeaders,
	blockBypassIdCookieName
}) {
	try {
		throwErrorForErrorResponse(response, { status })
	} catch (error) {
		switch (status) {
			case 403:
				// Maybe analyze the `response` in order to throw "UNAUTHORIZED" error
				// in cases when the user is not authorized to perform a certain action.
				throw new Error('INCORRECT_CAPTCHA_SOLUTION')
			default:
				throw error
		}
	}

	const blockBypassCookie = getCookie(blockBypassIdCookieName, { headers, getSetCookieHeaders })

	if (!blockBypassCookie) {
		throw new Error('BLOCK_BYPASS_ID_COOKIE_MISSING_IN_RESPONSE')
	}

	return {
		token: blockBypassCookie.value,
		expiresAt: blockBypassCookie.expires
	}
}
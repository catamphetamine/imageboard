import getCookie from '../../../utility/getCookie.js'
import throwErrorForErrorResponse from '../throwErrorForErrorResponse.js'

export default function parseCreateBlockBypassResponse(response, {
	headers,
	getSetCookieHeaders,
	blockBypassIdCookieName
}) {
	throwErrorForErrorResponse(response)

	const blockBypassCookie = getCookie(blockBypassIdCookieName, { headers, getSetCookieHeaders })

	if (!blockBypassCookie) {
		throw new Error('BLOCK_BYPASS_ID_COOKIE_MISSING_IN_RESPONSE')
	}

	return {
		token: blockBypassCookie.value,
		expiresAt: blockBypassCookie.expires
	}
}
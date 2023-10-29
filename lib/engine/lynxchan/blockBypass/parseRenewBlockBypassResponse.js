import throwErrorForErrorResponse from '../throwErrorForErrorResponse.js'

export default function parseRenewBlockBypassResponse(response, { headers }) {
	throwErrorForErrorResponse(response)

	const blockBypassId = getCookie('bypass', { headers, getSetCookieHeaders })

	return {
		id: blockBypassId
	}
}
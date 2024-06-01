export default function throwErrorForErrorResponse(response, { status }) {
	if (!status) {
		throw new Error('HTTP_RESPONSE_STATUS_MISSING')
	}

	if (status >= 200 && status < 400) {
		// No error.
		return
	}

	let errorMessage

	if (status === 429) {
		errorMessage = 'RATE_LIMIT_EXCEEDED'
	} else if (status === 403) {
		if (response && response.message === 'Please complete a block bypass to continue') {
			errorMessage = 'BLOCK_BYPASS_INVALID'
		} else {
			errorMessage = 'UNAUTHORIZED'
		}
	} else if (status === 503) {
		errorMessage = 'MAINTENANCE'
	} else {
		if (response && response.title && response.message) {
			errorMessage = response.title + ': ' + response.message
		} else {
			errorMessage = JSON.stringify(response)
		}
	}

	const error = new Error(errorMessage)
	error.status = status
	error.data = response
	throw error
}
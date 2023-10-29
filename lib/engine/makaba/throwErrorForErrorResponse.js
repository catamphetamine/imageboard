import isObject from '../../utility/isObject.js'

export default function throwErrorForErrorResponse(response) {
	const { error, result } = response
	if (result === 1) {
		// No error.
	} else if (result === 0) {
		if (isObject(error)) {
			if (typeof error.code === 'number' && typeof error.message === 'string') {
				switch (error.code) {
					case -22:
						throw new Error('RATE_LIMIT_EXCEEDED')
					case -31:
						throw new Error('COMMENT_NOT_FOUND')
				}
				// The error instance `.message` should be equal to `response.error.message`.
				// The reason is because `response.error.message` sometimes contains the info
				// that is not present in any other property. For example, "banned" error message
				// contains info on the ban reason, "until" date, etc.
				const errorInstance = new Error(error.message)
				errorInstance.code = error.code
				throw errorInstance
			} else {
				// Unknown shape of the `error` object.
				throw new Error(JSON.stringify(error))
			}
		} else {
			// Unknown type of the `error` property.
			throw new Error(JSON.stringify(error))
		}
	} else if (result === -1) {
		// When the user refreshes CAPTCHA too often, it just returns `{ result: -1 }`,
		// and, weirdly, with HTTP Status 200.
		throw new Error(JSON.stringify(response))
	} else {
		// Unknown shape of the `response` object.
		throw new Error(JSON.stringify(response))
	}
}
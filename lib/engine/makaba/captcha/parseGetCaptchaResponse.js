import throwErrorForErrorResponse from '../throwErrorForErrorResponse.js'

export default function parseGetCaptchaResponse(response, {
	toAbsoluteUrl,
	captchaExpiresIn,
	captchaImageUrl,
	captchaImageType,
	captchaImageWidth,
	captchaImageHeight,
	captchaWidth,
	captchaHeight
}) {
	try {
		throwErrorForErrorResponse(response)
	} catch (error) {
		// When the user refreshes CAPTCHA too often, it just returns `{ result: -1 }`,
		// and, weirdly, with HTTP Status 200.
		if (response.result === -1) {
			throw new Error('RATE_LIMIT_EXCEEDED')
		}
		// It returned the following response when attempted to get a CAPTCHA
		// while being logged in with a "passcode".
		// `{"result":2, "type":"passcode", "maxFiles":4, "maxFilesSize":40960, "maxImageResolution":40960}`
		// Apparently, solving a CAPTCHA is not required in case of being logged in.
		if (response.result === 2 && response.type === 'passcode') {
			throw new Error('NOT_REQUIRED')
		}
		throw error
	}

	const {
		challenge, // ?
		id, // CAPTCHA ID
		input, // "russian" or "numeric"
		result, // 0 or 1
		type // "2chcaptcha"
	} = response

	return {
		captcha: {
			id,
			image: {
				type: captchaImageType,
				url: captchaImageUrl.replace('{id}', id),
				width: captchaImageWidth,
				height: captchaImageHeight
			},
			type: 'text',
			challengeType: 'image',
			characterSet: getCharacterSet(input),
			expiresAt: typeof captchaExpiresIn === 'number'
				? new Date(Date.now() + captchaExpiresIn * 1000)
				: undefined
		}
	}
}

function getCharacterSet(type) {
	switch (type) {
		case 'russian':
			return 'russian'
		case 'numeric':
			return 'numeric'
		default:
			return type
	}
}
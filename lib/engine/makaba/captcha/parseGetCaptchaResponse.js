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
	// Check for errors.
	if (response.result !== 1) {
		if (response.error && response.error.code && response.error.message) {
			throw new Error(response.error.code + ': ' + response.error.message)
		}
		throw new Error('Unsupported response: ' + JSON.stringify(response))
	}

	const {
		challenge, // ?
		id, // CAPTCHA ID
		input, // "russian" or "numeric"
		result, // 0 or 1
		type // "2chcaptcha"
	} = response

	return {
		id,
		image: {
			type: captchaImageType,
			url: toAbsoluteUrl(captchaImageUrl.replace('{id}', id)),
			width: captchaImageWidth,
			height: captchaImageHeight
		},
		type: 'text',
		characterSet: getCharacterSet(input),
		expiresAt: typeof captchaExpiresIn === 'number'
			? new Date(Date.now() + captchaExpiresIn * 1000)
			: undefined
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
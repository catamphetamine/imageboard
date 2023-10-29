// import throwErrorForErrorResponse from './throwErrorForErrorResponse.js'

export default function parseGetCaptchaResponse(response, {
	headers,
	getSetCookieHeaders,
	captchaExpiresAtCookieName,
	captchaExpiresAtCookieFormat,
	captchaIdCookieName,
	captchaExpiresIn,
	captchaImageUrl,
	captchaImageType,
	captchaImageWidth,
	captchaImageHeight
}) {
	// Uses "Get CAPTCHA (with cookies)" API instead of "Get CAPTCHA (without cookies)" (JSON) API
	// https://gitgud.io/LynxChan/LynxChan/-/issues/86
	// The reason is that the JSON API doesn't return CAPTCHA expiration time.

	// throwErrorForErrorResponse(response)

	// const captchaId = response.data

	const captchaId = getCookie(captchaIdCookieName, { headers, getSetCookieHeaders })
	let captchaExpiresAt = getCookie(captchaExpiresAtCookieName, { headers, getSetCookieHeaders })
	captchaExpiresAt = parseDate(captchaExpiresAt, captchaExpiresAtCookieFormat)

	return {
		captcha: {
			id: captchaId,
			image: {
				type: captchaImageType,
				url: captchaImageUrl.replace('{id}', id),
				width: captchaImageWidth,
				height: captchaImageHeight
			},
			type: 'text',
			challengeType: 'image',
			expiresAt: captchaExpiresAt
		}
	}
}

function parseDate(string, format) {
	switch (format) {
		case 'UTC-string':
			return new Date(string)
		default:
			const date = new Date(string)
			if (isNaN(date.valueOf())) {
				throw new Error(`Invalid date: ${string}`)
			}
			return date
	}
}
import getCookieValue from '../../../utility/getCookieValue.js'

// import throwErrorForErrorResponse from '../throwErrorForErrorResponse.js'

export default function parseGetCaptchaResponse(response, {
	chan,
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
	// LynxChan doesn't return CAPTCHA expiration date as part of `/noCookieCaptcha.js?json=1` response.
	// https://gitgud.io/LynxChan/LynxChan/-/issues/86

	let captchaId

	// `endchan` runs on `InfinityNow` — a non-maintained fork of `LynxChan`.
	// https://gitgud.io/InfinityNow/LynxChan
	//
	// When requesting `/noCookieCaptcha.js?json=1` URL, it doesn't respond with
	// the usual LynxChan's `{ status, data }` JSON response.
	// Instead, it ignores the `?json=1` flag and just responds with an HTML page
	// containing a CAPTCHA challenge form.
	//
	// That HTML page could be parsed for the CAPTCHA image URL:
	// * `<img id="imageCaptcha" src="/captcha.js?captchaId=6548c9b9180ecff9fc90413b">`
	// * `<input type="hidden" name="captchaId" id="inputCaptchaId" value="6548c9b9180ecff9fc90413b">`
	//
	// EndChan doesn't support `/captcha.js?json=1` API either:
	// it simply returns the CAPTCHA image as if no `?json=1` flag was passed.
	//
	// My guess would be that `InfinityNow` was forked from `LynxChan` before it had
	// introduced the `?json=1` flag on API endpoints.
	//
	if (chan === 'endchan') {
		if (typeof response === 'string') {
			const ENDCHAN_CAPTCHA_ID_REG_EXP = /<input type="hidden" name="captchaId" id="inputCaptchaId" value="([^"]+)">/
			const match = response.match(ENDCHAN_CAPTCHA_ID_REG_EXP)
			if (match) {
				const [matched, capturedGroup1] = match
				captchaId = capturedGroup1
			}
		}

		throw new Error('INVALID_RESPONSE')
	}


	// throwErrorForErrorResponse(response)

	// const captchaId = response.data

	// In case of using `/captcha.js?json=1` API.
	// const captchaId = getCookieValue(captchaIdCookieName, { headers, getSetCookieHeaders })
	// let captchaExpiresAt = getCookieValue(captchaExpiresAtCookieName, { headers, getSetCookieHeaders })
	// captchaExpiresAt = parseDate(captchaExpiresAt, captchaExpiresAtCookieFormat)

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
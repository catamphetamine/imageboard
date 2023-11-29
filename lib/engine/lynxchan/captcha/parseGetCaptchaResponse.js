import getCookie from '../../../utility/getCookie.js'

import throwErrorForErrorResponse from '../throwErrorForErrorResponse.js'

// https://stackoverflow.com/questions/11526504/minimum-and-maximum-date
const MAX_DATE = new Date(8640000000000000)

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
	let captchaExpiresAt

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

		if (!captchaId) {
			throw new Error('INVALID_RESPONSE')
		}

		captchaExpiresAt = MAX_DATE
	} else {
		const SHOULD_USE_NO_COOKIE_GET_CAPTCHA_API = true

		if (SHOULD_USE_NO_COOKIE_GET_CAPTCHA_API) {
			throwErrorForErrorResponse(response)

			captchaId = response.data

			// It doesn't return CAPTCHA expiration date.
			// https://gitgud.io/LynxChan/LynxChan/-/issues/86
			captchaExpiresAt = MAX_DATE
		} else {
			const captchaIdCookie = getCookie(captchaIdCookieName, { headers, getSetCookieHeaders })

			if (!captchaIdCookie) {
				throw new Error('CAPTCHA_ID_COOKIE_MISSING_IN_RESPONSE')
			}

			captchaId = captchaIdCookie.value

			const captchaExpiresAtCookie = getCookie(captchaExpiresAtCookieName, { headers, getSetCookieHeaders })

			// There's always `captchaexpiration` cookie when there's `captchaid` cookie.
			// Still, if someone changes something in `lynxchan` engine code in some future,
			// having that `captchaexpiration` date is not really that critical.
			// So I added an `if`/`else` here just so it doesn't crash in an unrealistic scenario
			// of having a `captchaid` cookie and not having a `captchaexpiration` cookie.
			if (captchaExpiresAtCookie) {
				try {
					captchaExpiresAt = parseDate(captchaExpiresAtCookie.value, captchaExpiresAtCookieFormat)
				} catch (error) {
					console.error(`[imageboard] Error while parsing CAPTCHA expiration date cookie value "${captchaExpiresAtCookie.value}":`)
					console.error(error)
				}
			}

			// This `if` shouldn't ever happen.
			// But I added it just in case something weird or impossible happens
			// just because having `captchaExpiresAt` date is not really that critical.
			if (!captchaExpiresAt) {
				captchaExpiresAt = captchaIdCookie.expiresAt
			}
		}
	}

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
	const date = parseDate_(string, format)
	if (isNaN(date.valueOf())) {
		throw new Error(`Invalid date: ${string}`)
	}
	return date
}

function parseDate_(string, format) {
	switch (format) {
		case 'UTC-string':
			return new Date(string)
		default:
			return new Date(string)
	}
}
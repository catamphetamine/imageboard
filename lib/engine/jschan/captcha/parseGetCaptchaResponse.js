import throwErrorForErrorResponse from '../throwErrorForErrorResponse.js'
import getCookie from '../../../utility/getCookie.js'

export default function parseGetCaptchaResponse(response, {
	status,
	headers,
	getSetCookieHeaders,
	captchaIdCookieName,
	captchaImageUrl,
	captchaImageType,
	captchaImageWidth,
	captchaImageHeight
}) {
	throwErrorForErrorResponse(response, { status })

	// if (!status) {
	// 	throw new Error('HTTP_RESPONSE_STATUS_MISSING')
	// }

	// if (status !== 302) {
	// 	throw new Error('REDIRECT_EXPECTED')
	// }

	const captchaIdCookie = getCookie(captchaIdCookieName, { headers, getSetCookieHeaders })

	if (!captchaIdCookie) {
		throw new Error('CAPTCHA_ID_COOKIE_MISSING_IN_RESPONSE')
	}

	const captchaId = captchaIdCookie.value
	const captchaExpiresAt = captchaIdCookie.expires

	// const captchaImageUrl = headers.get('location')
	// if (!captchaImageUrl) {
	// 	throw new Error('REDIRECT_LOCATION_MISSING_IN_RESPONSE')
	// }

	return {
		captcha: {
			id: captchaId,
			expiresAt: captchaExpiresAt,
			type: 'text',
			challengeType: 'image',
			image: {
				url: captchaImageUrl.replace('{id}', captchaId),
				type: captchaImageType,
				width: captchaImageWidth,
				height: captchaImageHeight
			}
		}
	}
}
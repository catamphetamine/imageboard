export default function parseGetCaptchaResponse(response, {
	captchaImageWidth,
	captchaImageHeight
}) {
	const {
		cookie,
		captchahtml,
		expires_in
	} = response

	let captchaImageType
	let captchaImageUrl

	const captchaImageUrlMatch = captchahtml.match(CAPTCHA_IMAGE_URL_REG_EXP)
	if (captchaImageUrlMatch) {
		captchaImageUrl = captchaImageUrlMatch[1]
		const captchaImageDataUrlMatch = captchaImageUrl.match(CAPTCHA_IMAGE_DATA_URL_REG_EXP)
		if (captchaImageDataUrlMatch) {
			captchaImageType = captchaImageDataUrlMatch[1]
		} else {
			// Fall back to "image/png" because it would seem logical
			// to generate CAPTCHA images in PNG format.
			captchaImageType = 'image/png'
		}
	} else {
		throw new Error('Unsupported CAPTCHA HTML: ' + captchahtml)
	}

	return {
		captcha: {
			id: cookie,
			image: {
				type: captchaImageType,
				url: captchaImageUrl,
				width: captchaImageWidth,
				height: captchaImageHeight
			},
			type: 'text',
			challengeType: 'image',
			expiresAt: new Date(Date.now() + expires_in * 1000)
		}
	}
}

const CAPTCHA_IMAGE_URL_REG_EXP = /^<image src="([^"]+)">$/
const CAPTCHA_IMAGE_DATA_URL_REG_EXP = /^data:([^;]+);/
import parseGetCaptchaResponse from './parseGetCaptchaResponse.js'

describe('parseGetCaptchaResponse', () => {
	it('should parse get CAPTCHA response', () => {
		const { captcha } = parseGetCaptchaResponse(null, {
			status: 302,
			headers: {
				get(headerName) {
					switch (headerName) {
						// case 'location':
						// 	return '/captcha/61b55e3e49e367be7c5a818c.jpg'
						default:
							throw new Error(`Unsupported HTTP response header: ${headerName}`)
					}
				},
				getSetCookie() {
					return [
						'captchaid=61b55e3e49e367be7c5a818c; Max-Age=300; Path=/; Expires=Sun, 12 Dec 2021 02:33:14 GMT; Secure; SameSite=Strict'
					]
				}
			},
			captchaIdCookieName: 'captchaid',
			captchaImageUrl: '/captcha/{id}.jpg',
			captchaImageType: 'image/jpeg',
			captchaImageWidth: 210,
			captchaImageHeight: 80
		})

		captcha.should.deep.equal({
			id: '61b55e3e49e367be7c5a818c',
			type: 'text',
			expiresAt: new Date('Sun, 12 Dec 2021 02:33:14 GMT'),
			challengeType: 'image',
			image: {
				url: '/captcha/61b55e3e49e367be7c5a818c.jpg',
				type: 'image/jpeg',
				width: 210,
				height: 80
			}
		})
	})
})
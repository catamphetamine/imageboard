import parseGetCaptchaResponse from './parseGetCaptchaResponse.js'

describe('engine/infinity/captcha/parseGetCaptchaResponse', function() {
	it('should parse "get CAPTCHA" response', function() {
		const timestampBefore = Date.now()

		const expiresIn = 120

		const { captcha } = parseGetCaptchaResponse({
			cookie: 'dcjvqjrucujvlefwgrnu',
			captchahtml: '<image src="data:image\/png;base64,iVBOR...K5CYII=">',
			expires_in: 120
		}, {
			captchaImageWidth: 270,
			captchaImageHeight: 120
		})

		const timestampAfter = Date.now()

		expect(captcha.expiresAt.getTime() >= timestampBefore + expiresIn * 1000).to.equal(true)
		expect(captcha.expiresAt.getTime() <= timestampAfter + expiresIn * 1000).to.equal(true)

		delete captcha.expiresAt

		captcha.should.deep.equal({
			id: 'dcjvqjrucujvlefwgrnu',
			image: {
				type: 'image/png',
				url: 'data:image\/png;base64,iVBOR...K5CYII=',
				width: 270,
				height: 120
			},
			type: 'text',
			challengeType: 'image'
		})
	})
})
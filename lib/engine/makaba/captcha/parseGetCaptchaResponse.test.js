import parseGetCaptchaResponse from './parseGetCaptchaResponse.js'

describe('engine/makaba/captcha/parseGetCaptchaResponse', function() {
	it('should parse "get CAPTCHA" response', function() {
		const timestampBefore = Date.now()

		const expiresIn = 300

		const captcha = parseGetCaptchaResponse({
			result: 1,
			challenge: '90e4977d792abd2747cb2a18b250a89b19ad561f73e9fa8d3891b69cb3d64695b9e32239193ee85a907e95d8cf0d30b0f55b11533482411118cb4acc253269ec',
			id: 'b72d38a884697238ba78bee28dac269d38246d5ffc1eb87637efa7c1fa169a7625381ecb6ad6c74d6e531336415f0de18bec0a6db56d22bfdd96cb43f7b446d88b996abc66',
			input: 'russian',
			type: '2chcaptcha'
		}, {
			captchaImageUrl: '/api/captcha/2chcaptcha/show?id={id}',
			captchaImageType: 'image/png',
			captchaImageWidth: 270,
			captchaImageHeight: 120,
			toAbsoluteUrl: (url) => 'https://2ch.hk' + url,
			captchaExpiresIn: expiresIn
		})

		const timestampAfter = Date.now()

		expect(captcha.expiresAt.getTime() >= timestampBefore + expiresIn * 1000).to.equal(true)
		expect(captcha.expiresAt.getTime() <= timestampAfter + expiresIn * 1000).to.equal(true)

		delete captcha.expiresAt

		captcha.should.deep.equal({
			id: 'b72d38a884697238ba78bee28dac269d38246d5ffc1eb87637efa7c1fa169a7625381ecb6ad6c74d6e531336415f0de18bec0a6db56d22bfdd96cb43f7b446d88b996abc66',
			image: {
				type: 'image/png',
				url: 'https://2ch.hk/api/captcha/2chcaptcha/show?id=b72d38a884697238ba78bee28dac269d38246d5ffc1eb87637efa7c1fa169a7625381ecb6ad6c74d6e531336415f0de18bec0a6db56d22bfdd96cb43f7b446d88b996abc66',
				width: 270,
				height: 120
			},
			characterSet: 'russian',
			type: 'text'
		})
	})

	it('should throw an error on error', function() {
		expect(() => {
			parseGetCaptchaResponse({
				result: 0,
				error: {
					code: 'ERR',
					message: 'Error'
				}
			}, {})
		}).to.throw('ERR: Error')
	})
})
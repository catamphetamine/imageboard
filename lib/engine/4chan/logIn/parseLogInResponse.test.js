import parseLogInResponse from './parseLogInResponse.js'

describe('parseLogInResponse', () => {
	it('should parse log in response', () => {
		parseLogInResponse({ status: 0, message: 'Your device is now authorized.' }, {
			headers: {
				get(headerName) {
					switch (headerName) {
						case 'location':
							return null
						default:
							throw new Error(`Unsupported HTTP response header: ${headerName}`)
					}
				},
				getSetCookie() {
					return [
						'pass_id=61b55e3e49e367be7c5a818c; Max-Age=600; Path=/; Expires=Sun, 12 Dec 2021 02:33:14 GMT; Secure; SameSite=Strict'
					]
				}
			},
			accessTokenCookieName: 'pass_id',
			bannedUrl: '/banned'
		}).should.deep.equal({
			accessToken: '61b55e3e49e367be7c5a818c'
		})
	})
})
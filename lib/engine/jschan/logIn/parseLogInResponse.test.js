import parseLogInResponse from './parseLogInResponse.js'

describe('parseLogInResponse', () => {
	it('should parse log in response', () => {
		parseLogInResponse(null, {
			status: 302,
			headers: {
				get(headerName) {
					switch (headerName) {
						default:
							throw new Error(`Unsupported HTTP response header: ${headerName}`)
					}
				},
				getSetCookie() {
					return [
						'connect.sid=61b55e3e49e367be7c5a818c; Max-Age=600; Path=/; Expires=Sun, 12 Dec 2021 02:33:14 GMT; Secure; SameSite=Strict'
					]
				}
			},
			accessTokenCookieName: 'connect.sid'
		}).should.deep.equal({
			accessToken: '61b55e3e49e367be7c5a818c'
		})
	})
})
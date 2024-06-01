import parseCreateBlockBypassResponse from './parseCreateBlockBypassResponse.js'

describe('parseCreateBlockBypassResponse', () => {
	it('should parse create block bypass response', () => {
		parseCreateBlockBypassResponse({
			status: 'ok'
		}, {
			headers: {
				get(headerName) {
					switch (headerName) {
						default:
							throw new Error(`Unsupported HTTP response header: ${headerName}`)
					}
				},
				getSetCookie() {
					return [
						'bypass=61b55e3e49e367be7c5a818c; Max-Age=600; Path=/; Expires=Sun, 12 Dec 2021 02:33:14 GMT; Secure; SameSite=Strict'
					]
				}
			},
			blockBypassIdCookieName: 'bypass'
		}).should.deep.equal({
			token: '61b55e3e49e367be7c5a818c',
			expiresAt: new Date('Sun, 12 Dec 2021 02:33:14 GMT')
		})
	})
})
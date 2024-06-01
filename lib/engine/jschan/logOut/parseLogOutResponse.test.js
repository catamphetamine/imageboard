import parseLogOutResponse from './parseLogOutResponse.js'

describe('parseLogOutResponse', () => {
	it('should parse log out response', () => {
		parseLogOutResponse(null, {
			status: 302
		})
	})
})
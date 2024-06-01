import parseCreateThreadResponse from './parseCreateThreadResponse.js'

describe('parseCreateThreadResponse', () => {
	it('should parse create thread response', () => {
		parseCreateThreadResponse({
			thread: 123,
			redirect: '/b/thread/123.html'
		}, {
			status: 200
		}).should.deep.equal({
			id: 123
		})
	})
})
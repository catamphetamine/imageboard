import parseCreateThreadResponse from './parseCreateThreadResponse.js'

describe('engine/makaba/comment/parseCreateThreadResponse', function() {
	it('should parse "create comment" response', function() {
		parseCreateThreadResponse({ result: 1, thread: 12345 }).should.deep.equal({
			id: 12345
		})
	})

	it('should throw an error on error', function() {
		expect(() => {
			parseCreateThreadResponse({
				result: 0,
				error: {
					code: 'ERR',
					message: 'Error'
				}
			}, {})
		}).to.throw('ERR: Error')
	})
})
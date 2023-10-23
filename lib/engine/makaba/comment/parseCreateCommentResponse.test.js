import parseCreateCommentResponse from './parseCreateCommentResponse.js'

describe('engine/makaba/comment/parseCreateCommentResponse', function() {
	it('should parse "create comment" response', function() {
		parseCreateCommentResponse({ result: 1, num: 12345 }).should.deep.equal({
			id: 12345
		})
	})

	it('should throw an error on error', function() {
		expect(() => {
			parseCreateCommentResponse({
				result: 0,
				error: {
					code: 'ERR',
					message: 'Error'
				}
			}, {})
		}).to.throw('ERR: Error')
	})
})
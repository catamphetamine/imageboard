import parseCreateCommentResponse from './parseCreateCommentResponse.js'

describe('parseCreateCommentResponse', () => {
	it('should parse create comment response', () => {
		parseCreateCommentResponse({
			postId: 123,
			redirect: '/b/thread/111.html#123'
		}, {
			status: 200
		}).should.deep.equal({
			id: 123
		})
	})
})
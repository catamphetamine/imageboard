import parseCreateCommentResponse from './parseCreateCommentResponse.js'

describe('parseCreateCommentResponse', () => {
	it('should parse create comment response', () => {
		parseCreateCommentResponse({ tid: 123, pid: 456 }).should.deep.equal({ id: 456 })
	})

	it('should parse create comment response (error: spam)', () => {
		expect(() => {
			parseCreateCommentResponse({ error: 'Error: Our system thinks your post is spam. Please reformat and try again.' })
		}).to.throw('SPAM_PROTECTION')
	})
})
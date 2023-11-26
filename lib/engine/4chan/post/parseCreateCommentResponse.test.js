import parseCreateCommentResponse from './parseCreateCommentResponse.js'

describe('parseCreateCommentResponse', () => {
	it('should parse create comment response', () => {
		parseCreateCommentResponse('<html><head><title>Post successful</title></head><body> ... thread:123,no:456 </body></html>').should.deep.equal({ id: 456 })
	})

	it('should parse create comment response (error: spam)', () => {
		expect(() => {
			parseCreateCommentResponse('<html><body><div id="errmsg">Our system thinks your post is spam. Please reformat and try again.</div></body></html>')
		}).to.throw('SPAM_PROTECTION')
	})
})
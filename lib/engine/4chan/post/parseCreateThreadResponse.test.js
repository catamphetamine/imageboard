import parseCreateThreadResponse from './parseCreateThreadResponse.js'

describe('parseCreateThreadResponse', () => {
	it('should parse create thread response', () => {
		parseCreateThreadResponse('<html><head><title>Post successful</title></head><body> ... Post successful ... thread:0,no:123 </body></html>').should.deep.equal({ id: 123 })
	})

	it('should parse create thread response (error: spam)', () => {
		expect(() => {
			parseCreateThreadResponse('<html><body><div id="errmsg">Our system thinks your post is spam. Please reformat and try again.</div></body></html>')
		}).to.throw('SPAM_PROTECTION')
	})
})
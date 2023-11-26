import parseReportCommentResponse from './parseReportCommentResponse.js'

describe('parseReportCommentResponse', () => {
	it('should parse report comment response', () => {
		parseReportCommentResponse('<html><body><h3><font>Report submitted</font></h3></body></html>')
	})

	it('should parse report comment response (error: spam)', () => {
		expect(() => {
			parseReportCommentResponse('<html><body><div id="errmsg">Our system thinks your post is spam.</div></body></html>')
		}).to.throw('SPAM_PROTECTION')
	})
})
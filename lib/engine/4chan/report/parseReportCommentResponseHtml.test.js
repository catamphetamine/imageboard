import parseReportCommentResponse from './parseReportCommentResponseHtml.js'

describe('parseReportCommentResponse (HTML)', () => {
	it('should parse report comment response', () => {
		parseReportCommentResponse('<html><body><h3><font>Report submitted</font></h3></body></html>')
	})

	it('should parse report comment response (error: spam)', () => {
		expect(() => {
			parseReportCommentResponse('<html><body><h3><font color=\'#FF0000\'>Error: Our system thinks your post is spam.</font></h3></body></html>')
		}).to.throw('SPAM_PROTECTION')
	})

	it('should parse report comment response (error: CAPTCHA)', () => {
		expect(() => {
			parseReportCommentResponse('<html><body><h3><font color=\'#FF0000\'>Error: You seem to have mistyped the CAPTCHA. Please try again.<br><br>4chan Pass users can bypass this CAPTCHA. [<a href=\"https:\/\/www.4chan.org\/pass\" target=\"_blank\">Learn More<\/a>]</font></h3></body></html>')
		}).to.throw('INCORRECT_CAPTCHA_SOLUTION')
	})
})
import parseReportCommentResponse from './parseReportCommentResponse.js'

describe('parseReportCommentResponse', () => {
	it('should parse report comment response', () => {
		parseReportCommentResponse({})
	})

	it('should parse report comment response (error: spam)', () => {
		expect(() => {
			parseReportCommentResponse({ error: 'Error: Our system thinks your post is spam.' })
		}).to.throw('SPAM_PROTECTION')
	})

	it('should parse report comment response (error: CAPTCHA)', () => {
		expect(() => {
			parseReportCommentResponse({ error: 'Error: You seem to have mistyped the CAPTCHA. Please try again.<br><br>4chan Pass users can bypass this CAPTCHA. [<a href=\"https:\/\/www.4chan.org\/pass\" target=\"_blank\">Learn More<\/a>]' })
		}).to.throw('INCORRECT_CAPTCHA_SOLUTION')
	})
})
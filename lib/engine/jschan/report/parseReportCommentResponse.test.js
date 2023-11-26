import parseReportCommentResponse from './parseReportCommentResponse.js'

describe('parseReportCommentResponse', () => {
	it('should parse report comment response', () => {
		parseReportCommentResponse(null, { status: 200 })
	})
})
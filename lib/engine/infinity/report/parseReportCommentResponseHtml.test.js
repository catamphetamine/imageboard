import parseReportCommentResponse from './parseReportCommentResponseHtml.js'

describe('parseReportCommentResponse (HTML)', () => {
	it('should parse report comment response', () => {
		parseReportCommentResponse('<html><body class="..."><header><h1>Report submitted!</h1><div class="subtitle"></div></header>...</body></html>')
	})
})
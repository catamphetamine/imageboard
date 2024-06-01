import parseReportCommentResponseHtml from './parseReportCommentResponseHtml.js'
import parseReportCommentResponseJson from './parseReportCommentResponseJson.js'

export default function parseReportCommentResponse(response) {
	if (typeof response === 'string') {
		return parseReportCommentResponseHtml(response)
	} else {
		return parseReportCommentResponseJson(response)
	}
}
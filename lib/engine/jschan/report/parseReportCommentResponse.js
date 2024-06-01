import throwErrorForErrorResponse from '../throwErrorForErrorResponse.js'

export default function parseReportCommentResponse(response, { status }) {
	throwErrorForErrorResponse(response, { status })

	return undefined
}
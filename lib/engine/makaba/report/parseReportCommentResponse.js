import throwErrorForErrorResponse from '../throwErrorForErrorResponse.js'

/**
 * Performs a "report" API request and parses the response.
 * @param  {object} response — API response JSON.
 * @return {void} Throws an error in case of an error.
 */
export default function parseReportCommentResponse(response) {
	try {
		throwErrorForErrorResponse(response)
	} catch (error) {
		switch (error.code) {
			case -50:
				throw new Error('TOO_MANY_COMMENTS_BEING_REPORTED')
			case -51:
				throw new Error('REPORT_CONTENT_REQUIRED')
			case -52:
				throw new Error('ALREADY_REPORTED')
			default:
				throw error
		}
	}
}
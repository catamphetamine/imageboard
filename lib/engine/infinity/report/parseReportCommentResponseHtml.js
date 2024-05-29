// https://www.javatips.net/api/chanu-master/app/src/com/chanapps/four/task/ReportPostTask.java
// https://www.javatips.net/api/chanu-master/app/src/com/chanapps/four/data/ReportPostResponse.java

const SUCCESS_REG_EXP = /<h1>Report submitted!<\/h1>/

/**
 * Performs a "report" API request and parses the response.
 * @param  {string} response — API response HTML.
 * @return {void} Throws an error in case of an error.
 */
export default function parseReportCommentResponseHtml(response) {
	if (SUCCESS_REG_EXP.test(response)) {
		return
	}

  throw new Error('UNEXPECTED_RESPONSE')
}
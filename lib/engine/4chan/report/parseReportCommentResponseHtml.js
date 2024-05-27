// https://www.javatips.net/api/chanu-master/app/src/com/chanapps/four/task/ReportPostTask.java
// https://www.javatips.net/api/chanu-master/app/src/com/chanapps/four/data/ReportPostResponse.java

const SUCCESS_REG_EXP = /<h3>(<font[^>]*>)?([^<]*Report submitted[^<]*)/
const BANNED_REG_EXP = /<h2>([^<]+)<span class=\"banType\">([^<]+)<\/span>([^<]+)<\/h2>/
const ERROR_REG_EXP = /<h3><font color='#FF0000'>([^<]+)/ // the HTML markup of "report" API error response is different from the markup of "post" API error response
const GENERIC_ERROR_REG_EXP = /<h3>(?:<font[^>]*>)?([^<]+)/

/**
 * Performs a "report" API request and parses the response.
 * @param  {string} response — API response HTML.
 * @return {void} Throws an error in case of an error. If the error is "banned" then the errorthen the error message is "BANNED" and the error object may have properties: `banReason`.
 */
export default function parseReportCommentResponse(response) {
	if (SUCCESS_REG_EXP.test(response)) {
		return
	}

	// Check for "user is banned" error.
	const banMatch = response.match(BANNED_REG_EXP)
	if (banMatch) {
		const banReason = banMatch[1] + ' ' + banMatch[2] + ' ' + banMatch[3]
		const error = new Error('BANNED')
		error.banReason = banReason
		throw error
	}

	const errorMatch = response.match(ERROR_REG_EXP)
	if (errorMatch) {
		const errorMessage = normalizeErrorMessage(errorMatch[1])
		switch (errorMessage) {
			case 'Our system thinks your post is spam.':
				throw new Error('SPAM_PROTECTION')
			case 'You seem to have mistyped the CAPTCHA. Please try again.':
				throw new Error('INCORRECT_CAPTCHA_SOLUTION')
		}
		throw new Error(errorMessage)
	}

	const genericErrorMatch = response.match(GENERIC_ERROR_REG_EXP)
	if (genericErrorMatch) {
		throw new Error(normalizeErrorMessage(genericErrorMatch[1]))
	}

  throw new Error('UNEXPECTED_RESPONSE')
}

function normalizeErrorMessage(errorMessage) {
	return errorMessage
		// Trim the `Error: ` prefix at the start.
		.replace('Error: ', '')
		// If the error message contains a `<br/>`, trim it and everything after it.
		.replace(/<br>.*$/, '')
}
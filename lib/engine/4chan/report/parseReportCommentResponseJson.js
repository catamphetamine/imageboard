/**
 * Performs a "report" API request and parses the response.
 * @param  {string} response — API response JSON.
 * @return {void} Throws an error in case of an error. If the error is "banned" then the errorthen the error message is "BANNED" and the error object may have properties: `banReason`.
 */
export default function parseReportCommentResponse(response) {
	if (!response) {
		// It's not clear what the "success" response looks like. Maybe it's empty.
  	// throw new Error('UNEXPECTED_RESPONSE')
		return
	}

	// Currently it doesn't cover all possible cases such as "user is banned", etc.
	// See `docs/engines/4chan.md` for an approximate list of possible responses.

	const { error } = response
	if (error) {
		const errorMessage = normalizeErrorMessage(error)
		switch (errorMessage) {
			case 'Our system thinks your post is spam.':
				throw new Error('SPAM_PROTECTION')
			case 'You seem to have mistyped the CAPTCHA. Please try again.':
				throw new Error('INCORRECT_CAPTCHA_SOLUTION')
		}
		throw new Error(errorMessage)
	}
}

function normalizeErrorMessage(errorMessage) {
	return errorMessage
		// Trim the `Error: ` prefix at the start.
		.replace('Error: ', '')
		// If the error message contains a `<br/>`, trim it and everything after it.
		.replace(/<br>.*$/, '')
}
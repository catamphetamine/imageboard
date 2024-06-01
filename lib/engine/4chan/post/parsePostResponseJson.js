/**
 * Performs a "post" API request and parses the response.
 * @param  {string} response — API response JSON.
 * @return {object} Returns an object having an `id` property: either new thread ID or new comment ID. Throws an error in case of an error. If the error is "banned" then the error message is "BANNED" and the error object may have properties: `banReason`.
 */
export default function parsePostResponse(response) {
	if (!response) {
		throw new Error('UNEXPECTED_RESPONSE')
	}

	const {
		tid: threadId,
		pid: commentId,
		error
	} = response

	if (error) {
		const errorMessage = normalizeErrorMessage(error)
		switch (errorMessage) {
			case 'Our system thinks your post is spam. Please reformat and try again.':
				throw new Error('SPAM_PROTECTION')
			case 'You seem to have mistyped the CAPTCHA. Please try again.':
				throw new Error('INCORRECT_CAPTCHA_SOLUTION')
			case 'Specified thread does not exist.':
				throw new Error('THREAD_NOT_FOUND')
		}
		throw new Error(errorMessage)
	}

	// Currently it doesn't cover all possible cases such as "user is banned", etc.
	// See `docs/engines/4chan.md` for an approximate list of possible responses.

	// In case of "create comment" API call, the response is `{ tid, pid }`.
	//
	// It's unknown what the API response is in case of "create thread" API call.
	// A current guess is that `tid` is `0` and `pid` is the thread id.
	//
	if (commentId || threadId) {
		return {
			id: commentId || threadId
		}
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
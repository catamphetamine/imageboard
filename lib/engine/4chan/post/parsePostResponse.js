// https://www.javatips.net/api/chanu-master/app/src/com/chanapps/four/task/PostReplyTask.java
// https://www.javatips.net/api/chanu-master/app/src/com/chanapps/four/data/ChanPostResponse.java

const SUCCESS_REG_EXP = /(<title.+)(Post successful)/
const IDS_REG_EXP = /thread:(\d+),no:(\d+)/ // <!-- thread:44593688,no:44595010 -->
const BANNED_REG_EXP = /<h2>([^<]+)<span class=\"banType\">([^<]+)<\/span>([^<]+)<\/h2>/
const ERROR_REG_EXP = /id=\"errmsg\"[^>]*>([^<]+)/
const GENERIC_ERROR_REG_EXP = /<h3>(?:<font[^>]*>)?([^<]+)/

/**
 * Performs a "post" API request and parses the response.
 * @param  {string} response — API response HTML.
 * @return {number} Returns new thread ID or new comment ID. Throws an error in case of an error. If the error is "banned" then the error message is "BANNED" and the error object may have properties: `banReason`.
 */
export default function parsePostResponse(response) {
	if (SUCCESS_REG_EXP.test(response)) {
		const idsMatch = response.match(IDS_REG_EXP)
		if (idsMatch) {
			let threadId = parseInt(idsMatch[1])
			let commentId = parseInt(idsMatch[2])
			// "API strangely uses postNo instead of threadNo when you post a new thread"
			if (threadId === 0) {
				// Posted a new thread.
				return commentId
			}
			// Posted a new comment.
			return commentId
		}
		return {}
	}
	const banMatch = response.match(BANNED_REG_EXP)
	if (banMatch) {
		const banReason = banMatch[1] + ' ' + banMatch[2] + ' ' + banMatch[3]
		const error = new Error('BANNED')
		error.banReason = banReason
		throw error
	}
	const errorMatch = response.match(ERROR_REG_EXP)
	if (errorMatch) {
		const errorMessage = errorMatch[1].replace('Error: ', '')
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
	const genericErrorMatch = response.match(GENERIC_ERROR_REG_EXP)
	if (genericErrorMatch) {
		throw new Error(genericErrorMatch[1].replace('Error: ', ''))
	}
  throw new Error()
}
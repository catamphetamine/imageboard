import throwErrorForErrorResponse from '../throwErrorForErrorResponse.js'

/**
 * Performs a "post" API request and parses the response.
 * @param  {object} response — API response JSON.
 * @return {number} Returns new thread ID or new comment ID. Throws an error in case of an error. If the error is "banned" then the errorthen the error message is "BANNED" and the error object may have properties: `banId`, `banReason`, `banBoardId`, `banEndsAt`.
 */
export default function parsePostResponse(response) {
	try {
		throwErrorForErrorResponse(response)
	} catch (error) {
		switch (error.code) {
			case -1:
				throw new Error('DATABASE_UNAVAILABLE')
			case -2:
				throw new Error('BOARD_NOT_FOUND')
			case -4:
				throw new Error('ACCESS_DENIED')
			case -5:
				throw new Error('INCORRECT_CAPTCHA_SOLUTION')
			case -6:
				const errorInstance = new Error('BANNED')
				const {
					banReason,
					banId,
					banBoardId,
					banEndsAt
				} = parseBanReason(error.message)
				errorInstance.banReason = banReason
				errorInstance.banId = banId
				errorInstance.banBoardId = banBoardId
				errorInstance.banEndsAt = banEndsAt
				throw errorInstance
			case -7:
				throw new Error('THREAD_IS_LOCKED')
			case -8:
				throw new Error('BOARD_MAX_POSTING_RATE_EXCEEDED')
			case -10:
				throw new Error('DUPLICATE_ATTACHMENTS_DETECTED')
			case -11:
				throw new Error('ATTACHMENT_TYPE_NOT_SUPPORTED')
			case -13:
				throw new Error('TOO_MANY_ATTACHMENTS')
			case -15:
				throw new Error('COMMENT_IS_TOO_LONG')
			case -16:
				throw new Error('BLACKLISTED_WORD_DETECTED')
			case -20:
				throw new Error('CONTENT_IS_REQUIRED')
			default:
				throw error
		}
	}

	if (response.thread) {
		// Posted a new thread.
		// Returns the ID of the new thread.
		return {
			id: response.thread
		}
	}

	if (response.num) {
		// Posted a new comment.
		// Returns the ID of the new comment.
		return {
			id: response.num
		}
	}

	throw new Error('Unsupported response: ' + JSON.stringify(response))
}

function parseMonth(month) {
	switch (month) {
		case 'Янв':
			return 1
		case 'Фев':
			return 2
		case 'Мар':
			return 3
		case 'Апр':
			return 4
		case 'Май':
			return 5
		case 'Июн':
			return 6
		case 'Июл':
			return 7
		case 'Авг':
			return 8
		case 'Сен':
			return 9
		case 'Окт':
			return 10
		case 'Ноя':
			return 11
		case 'Дек':
			return 12
	}
}

function parseBanReason(banReason) {
	let banId
	let banBoardId
	let banEndsAt
	// "Постинг запрещён. Бан: <id-бана>. Причина: <причина> //!mg. Истекает: Чтв Июн 01 00:00:00 2015."
	const match = banReason.match(/^Постинг запрещён\. Бан: (.+)\. Причина: (.+)\.$/)
	if (match) {
		banId = parseInt(match[1])
		banReason = match[2]
		// "<причина> //!mg. Истекает: Чтв Июн 01 00:00:00 2015."
		const reasonMatch = banReason.match(/(?: \/\/!(.+))?\.(?: Истекает: (.+))?$/)
		if (reasonMatch) {
			// "<причина>"
			const reason = banReason.slice(0, banReason.indexOf(reasonMatch[0]))
			// "mg"
			banBoardId = reasonMatch[1]
			// "Чтв Июн 01 00:00:00 2015"
			const endDate = reasonMatch[2]
			if (endDate) {
				const endDateMatch = endDate.match(/^(.{3}) (.{3}) (\d{2}) (\d{2}):(\d{2}):(\d{2}) (\d{4})$/)
				if (endDateMatch) {
					const [
						_unused1,
						_unused2,
						month,
						day,
						hours,
						minutes,
						seconds,
						year
					] = endDateMatch
					banEndsAt = new Date(
						parseInt(year),
						parseMonth(month) - 1,
						parseInt(day),
						parseInt(hours),
						parseInt(minutes),
						parseInt(seconds)
					)
					banReason = reason
				}
			}
		}
	}
	return {
		banReason,
		banId,
		banBoardId,
		banEndsAt
	}
}
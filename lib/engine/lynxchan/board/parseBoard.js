export default function parseBoard(board, { boardId } = {}) {
	const parsedBoard = {
		// `boardUri` property doesn't exist in "get threads page" API response.
		// It is present on each of the `threads[]` in that response
		// but if the list of `threads[]` is empty then there's no info on the board ID.
		id: board.boardUri || boardId,

		// `endchan.net` runs on an old version of LynxChan (1.7.5)
		// and it doesn't have `boardName` property in "get thread" API response.
		//
		// In that case, `id` is used as a substitute for `title`
		// because a `Board` is required to have a `title` property.
		//
		title: board.boardName || board.boardUri,

		// `boardDescription` is `"."` on all boards on `kohlchan.net`
		description: board.boardDescription === '.' ? undefined : board.boardDescription,

		stats: {
			// "Comments posted per hour" stats for this board.
			commentsPerHour: board.postsPerHour,

			// "Unique comment posters per day" stats for this board.
			uniquePostersPerDay: board.uniqueIps
		},

		post: {
			// (?) Seems to only be present in "get thread" API response?
			authorName: !board.forceAnonymity,

			contentMaxLength: board.maxMessageLength,
			attachmentsMaxCount: board.maxFileCount,
			// Example: "128.00 MB".
			attachmentMaxSize: board.maxFileSize && parseFileSize(board.maxFileSize),

			// `captcha: boolean` property is supposed to be present
			// in non-old versions of LynxChan in "get thread" API response.
			//
			// It tells whether posting a comment in the thread requires solving a CAPTCHA.
			//
			captchaRequired: board.captcha,

			// Whether the board allows posting attachments.
			attachments: !board.textBoard,

			authorIcons: board.flagData && board.flagData.map(({ _id, name }) => ({
				id: _id,
				title: name
			}))
		},

		features: {}
	}

	if (board.specialSettings && board.specialSettings.includes('sfw')) {
		board.explicitContent = false
	}

	return parsedBoard
}

function parseFileSize(size) {
	const number = parseFloat(size)
	const unit = size.slice(size.indexOf(' ') + 1)
	switch (unit) {
		case 'KB':
			return number * 1024
		case 'MB':
			return number * 1024 * 1024
		case 'GB':
			return number * 1024 * 1024 * 1024
		default:
			console.error(`Unsupported lynxchan maxFileSize unit: ${unit}`)
			return undefined
	}
}
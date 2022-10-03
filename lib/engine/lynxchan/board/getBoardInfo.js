export default function getBoardInfo({
	boardName,
	// `boardDescription` is `"."` on all boards on `kohlchan.net`
	flagData,
	captcha,
	maxMessageLength,
	maxFileCount,
	maxFileSize,
	textBoard,
	forceAnonymity
}) {
	const board = {
		maxCommentLength: maxMessageLength,
		// Example: 4.
		maxAttachments: maxFileCount,
		// Example: "128.00 MB".
		maxAttachmentSize: maxFileSize && parseFileSize(maxFileSize),
		// Feature flags.
		features: {}
	}
	// `endchan.net` doesn't have `boardName` (LynxChan 1.7.5).
	if (boardName !== undefined) {
		board.title = boardName
	}
	if (flagData) {
		board.badges = flagData.map(({ _id, name }) => ({
			id: _id,
			title: name
		}))
	}
	// Whether the thread requires solving a CAPTCHA in order to post a comment.
	if (captcha) {
		board.captcha = true
	}
	// Whether the board doesn't allow posting attachments.
	if (textBoard) {
		board.features.attachments = false
	}
	// Only for "get thread" API response.
	if (forceAnonymity) {
		// `forceAnonymity: true` disables author names on a board:
		// forces empty/default `name` on all posts in all threads of the board.
		board.features.authorName = false
	}
	return board
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
			return 0
	}
}
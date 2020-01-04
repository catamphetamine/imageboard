export default function getBoardInfo({
	boardName,
	flagData,
	captcha,
	maxMessageLength,
	maxFileCount,
	maxFileSize
}) {
	const board = {
		maxCommentLength: maxMessageLength,
		// Example: 4.
		maxAttachments: maxFileCount,
		// Example: "128.00 MB".
		maxAttachmentSize: maxFileSize && parseFileSize(maxFileSize)
	}
	// `endchan.net` doesn't have `boardName` (LynxChan 1.7.5).
	if (boardName !== undefined) {
		board.title = boardName
	}
	if (flagData) {
		board.badges = flagData.map(({ _id, name }) => ({ id: _id, title: name }))
	}
	if (captcha) {
		board.captcha = true
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
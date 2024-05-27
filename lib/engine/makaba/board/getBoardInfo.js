export default function getBoardInfo(board) {
	const parsedBoard = {
		id: board.id,
		title: board.name,
		defaultAuthorName: board.default_name,
		bumpLimit: board.bump_limit,
		commentContentMaxLength: board.max_comment,
		attachmentsMaxTotalSize: board.max_files_size,
		features: {
			votes: board.enable_likes,
			countryFlags: board.enable_flags,
			badges: board.enable_icons,
			threadTitle: board.enable_subject,
			commentTitle: board.enable_subject,
			// It's not clear whether `file_types` property always exists or not.
			attachments: board.file_types !== undefined && board.file_types.filter(_ => _ !== 'youtube').length > 0,
			threadTags: board.enable_thread_tags
		}
	}
	if (board.enable_icons && board.icons) {
		parsedBoard.badges = board.icons.map(({ name, num }) => ({ id: num, title: name }))
	}
	return parsedBoard
}
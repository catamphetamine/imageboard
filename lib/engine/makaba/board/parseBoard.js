/**
 * Parses response board JSON object.
 * @param  {object} board — Response board JSON object.
 * @return {object} See README.md for "Board" object description.
 */
export default function parseBoard(board) {
	const parsedBoard = {
		id: board.id,
		title: board.name,
		description: board.info_outer,
		category: board.category,
		// commentsPerHour: board.speed,
		bumpLimit: board.bump_limit,
		features: {}
	}
	if (board.enable_names === 1) {
		parsedBoard.features.authorName = true
	}
	if (board.enable_sage === 1) {
		parsedBoard.features.sage = true
	}
	if (board.category === 'Пользовательские') {
		parsedBoard.category = 'Прочие'
	}
	if (board.category === 'Взрослым') {
		parsedBoard.notSafeForWork = true
	}
	if (board.icons) {
		parsedBoard.icons = board.icons
	}
	if (board.tags) {
		parsedBoard.tags = board.tags
	}
	return parsedBoard
}
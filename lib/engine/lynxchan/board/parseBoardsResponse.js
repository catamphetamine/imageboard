/**
 * Parses chan API response for boards list.
 * @param  {object} response — Chan API response for boards list.
 * @param  {object} options
 * @return {object[]} See README.md for "Board" object description.
 */
export default function parseBoards(response, options) {
	return response.topBoards.map((board) => ({
		id: board.boardUri,
		title: board.boardName
	}))
}
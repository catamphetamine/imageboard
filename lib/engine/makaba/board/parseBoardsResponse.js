import parseBoard from './parseBoard.js'

/**
 * Parses chan API response for boards list.
 * @param  {object} response — Chan API response for boards list.
 * @return {object[]} See README.md for "Board" object description.
 */
export default function parseBoardsResponse(response, options) {
	// // Parse tags.
	// const boardTags = {}
	// for (const tag of response.tags) {
	// 	boardTags[tag.board] = boardTags[tag.board] || []
	// 	boardTags[tag.board].push(tag.tag)
	// }
	// Parse boards.
	return response.map(board => parseBoard(board, options))
}
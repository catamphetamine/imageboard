import parseBoard from './parseBoard.js'
import parseBoardInfinity from '../../infinity/board/parseBoard.js'

/**
 * Parses chan API response for boards list.
 * @param  {object} response — Chan API response for boards list.
 * @return {object[]} See README.md for "Board" object description.
 */
export default function parseBoards(response, options) {
	switch (options.engine) {
		case 'infinity':
		case 'OpenIB':
			return response.map(parseBoardInfinity)
		default:
			return response.boards.map((board) => parseBoard(board, options))
	}
}
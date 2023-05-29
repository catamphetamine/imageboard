/**
 * Performs a "get boards list" API query and parses the response.
 * @param  {object} engineTools — API URLs and configuration parameters, `request()` function, `parseBoards()` function, etc.
 * @param  {object} [options] — See the README.
 * @return {Promise<object[]>} — A list of `Board` objects.
 */
export default function getBoards({
	boards: staticBoardsList,
	boardCategories,
	api,
	request,
	parseBoards,
	parseBoardsPage
}, options = {}) {
	// Some "legacy" chans don't provide `/boards.json` API
	// so their boards list is defined as a static one in JSON configuration.
	if (staticBoardsList) {
		return staticBoardsList.map(normalizeStaticallyDefinedBoard)
	}

	// Get the API endpoint.

	let apiMethod
	let page

	if (options.all) {
		if (api.getAllBoards) {
			apiMethod = api.getAllBoards
		} else if (api.getBoards) {
			apiMethod = api.getBoards
		} else if (api.getBoardsPage) {
			apiMethod = api.getBoardsPage
			page = 1
		}
	} else {
		if (api.getBoards) {
			apiMethod = api.getBoards
		} else if (api.getBoardsPage) {
			apiMethod = api.getBoardsPage
			page = 1
		}
	}

	// Validate URL.
	if (!apiMethod) {
		throw new Error('Couldn\'t determine the boards list API method')
	}

	// If no pagination is used, return the list of boards.
	if (!page) {
		return request(apiMethod).then(
			(response) => parseBoards(response, options)
		)
	}

	// Returns a `Promise`.
	const requestPage = (page) => {
		return request(apiMethod, { page })
	}

	// Iterate through boards list pages.
	function requestNextPage(page, pageCount, boards) {
		return requestPage(page).then(
			(response) => {
				const result = parseBoardsPage(response, options)
				if (pageCount === undefined) {
					pageCount = result.pageCount
					boards = []
				}
				boards = boards.concat(result.boards)
				if (page < pageCount) {
					return requestNextPage(page + 1, pageCount, boards)
				}
				return boards
			}
		)
	}

	return requestNextPage(page)
}

function normalizeStaticallyDefinedBoard(board) {
	if (!board.features) {
		board = {
			...board,
			features: {}
		}
	}
	return board
}
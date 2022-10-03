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
		return staticBoardsList
	}

	// Get the API endpoint URL.

	const {
		getAllBoards,
		getBoards,
		getBoardsPage
	} = api

	let url
	let page

	if (options.all) {
		if (getAllBoards) {
			url = getAllBoards
		} else if (getBoards) {
			url = getBoards
		} else if (getBoardsPage) {
			url = getBoardsPage
			page = 1
		}
	} else {
		if (getBoards) {
			url = getBoards
		} else if (getBoardsPage) {
			url = getBoardsPage
			page = 1
		}
	}

	// Validate URL.
	if (!url) {
		throw new Error('Couldn\'t determine the boards list URL')
	}

	// If no pagination is used, return the list of boards.
	if (!page) {
		return request(url).then(
			(response) => parseBoards(response, options)
		)
	}

	// Returns a `Promise`.
	const requestPage = (page) => {
		return request(url, {
			urlParameters: { page }
		})
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
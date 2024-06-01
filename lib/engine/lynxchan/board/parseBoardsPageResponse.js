import throwErrorForErrorResponse from '../throwErrorForErrorResponse.js'

/**
 * Parses "get boards list page" API response.
 * @param  {any} response
 * @param  {object} [options]
 * @return {object} An object of shape `{ boards: Board[], pageCount }`.
 */
export default function parseBoardsPage(response, options) {
	let { status, data } = response

	// `endchan` seems to be running on an old fork of `lynxchan`
	// that doesn't return `{ status, data }` from this endpoint
	// and instead just returns the `data` as it is.
	if (status) {
		throwErrorForErrorResponse(response)
	} else {
		data = response
	}

	let { pageCount, boards } = data
	boards = boards.map((board) => ({
		id: board.boardUri,
		title: board.boardName,
		description: board.boardDescription,
		notSafeForWork: !(Boolean(board.specialSettings) && board.specialSettings.includes('sfw')),
		locked: Boolean(board.specialSettings) && board.specialSettings.includes('locked'),
		commentsPerHour: board.postsPerHour,
		threadTags: board.tags,
		features: {
			threadTags: Boolean(board.tags) && board.tags.length > 0
		}
	}))

	const { chan, boardCategoryTitleById } = options

	if (chan === 'kohlchan') {
		for (const board of boards) {
			const tag = board.threadTags[0]
			if (tag) {
				const {
					category,
					categoryOrder,
					order
				} = getBoardCategoryAndOrderByTag(tag, {
					boardCategoryTitleById
				})
				if (category) {
					board.category = category
					board.categoryOrder = categoryOrder
					board.order = order
				}
			}
		}

		boards.sort(compareBoardsByOrder)

		for (const board of boards) {
			if (board.category) {
				delete board.categoryOrder
				delete board.order
			} else {
				board.category = boardCategoryTitleById['*']
			}
		}
	}

	return {
		pageCount,
		boards
	}
}

const KOHL_CHAN_BOARD_CATEGORY_TAG_REG_EXP = /^menu-(\d+)\/[nu]\/(.+)-(\d+)$/

function getBoardCategoryAndOrderByTag(tag, { boardCategoryTitleById }) {
	const match = tag.match(KOHL_CHAN_BOARD_CATEGORY_TAG_REG_EXP)
	if (match) {
		const categoryOrder = parseInt(match[1])
		const categoryId = match[2]
		const order = parseInt(match[3])
		return {
			category: boardCategoryTitleById[categoryId] || categoryId,
			categoryOrder,
			order
		}
	}
}

function compareBoardsByOrder(a, b) {
	if (a.category && !b.category) {
		return -1
	} else if (!a.category && b.category) {
		return 1
	} else if (!a.category && !b.category) {
		return 0
	} else {
		if (a.categoryOrder && !b.categoryOrder) {
			return -1
		} else if (!a.categoryOrder && b.categoryOrder) {
			return 1
		} else if (!a.categoryOrder && !b.categoryOrder) {
			return 0
		} else {
			if (a.categoryOrder > b.categoryOrder) {
				return 1
			} else if (a.categoryOrder < b.categoryOrder) {
				return -1
			} else {
				if (a.order && !b.order) {
					return -1
				} else if (!a.order && b.order) {
					return 1
				} else if (!a.order && !b.order) {
					return 0
				} else {
					if (a.order > b.order) {
						return 1
					} else if (a.order < b.order) {
						return -1
					} else {
						return 0
					}
				}
			}
		}
	}
}
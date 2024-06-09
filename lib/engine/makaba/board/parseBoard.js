import uniq from 'lodash/uniq.js'

import getBoardFlagValue from './getBoardFlagValue.js'

/**
 * Parses response board JSON object.
 * @param  {object} board — Response board JSON object.
 * @return {object} See README.md for "Board" object description.
 */
export default function parseBoard(board, {
	explicitContentBoardCategories,
	explicitContentBoards
}) {
	const parsedBoard = {
		id: board.id,
		title: board.name,
		description: board.info_outer,

		// `category` is not prsent in "get thread" API response.
		category: board.category === 'Пользовательские' ? 'Прочие' : board.category,

		post: {
			thread: getBoardFlagValue(board.enable_posting),
			threadTitle: getBoardFlagValue(board.enable_subject),
			authorName: getBoardFlagValue(board.enable_names),
			authorTripCode: getBoardFlagValue(board.enable_trips),
			authorEmailSage: getBoardFlagValue(board.enable_sage),
			authorIcon: getBoardFlagValue(board.enable_icons),
			authorCountry: getBoardFlagValue(board.enable_flags),
			// oekaki: getBoardFlagValue(board.enable_oekaki),
			// dices: getBoardFlagValue(board.enable_dices),
			threadTags: getBoardFlagValue(board.enable_thread_tags),

			// Thread titles aren't used on `/b/` board.
			threadTitle: board.id !== 'b',

			// It seems like one is required to attach a picture or a video when creating a thread.
			threadAttachmentsRequired: true,

			attachmentFileTypes: getAttachmentFileTypes(board.file_types),
			contentMaxLength: board.max_comment,

			// При входе с "пасскодом" этот лимит может быть больше.
			// Но текущий API входа не предоставляет таких данных.
			attachmentsMaxSize: board.max_files_size,

			// При входе с "пасскодом" этот лимит может быть больше.
			// Но текущий API входа не предоставляет таких данных.
			attachmentsMaxCount: 4,

			authorEmailSage: true,

			threadCaptchaRequired: true,
			captchaRequired: true
		},

		features: {
			defaultAuthorName: board.default_name,
			bumpLimit: board.bump_limit,
			commentRating: getBoardFlagValue(board.enable_likes) ? '↕' : undefined
			// ???: getBoardFlagValue(board.enable_shield)
		}
	}

	// It looks like one could specify at most a single tag when creating a thread.
	if (parsedBoard.post.threadTags) {
		parsedBoard.post.threadTagsMaxCount = 1
	}

	// Mark `explicitContent` boards.
	if (
		explicitContentBoardCategories && explicitContentBoardCategories.includes(board.category) ||
		explicitContentBoards && explicitContentBoards.includes(board.id)
	) {
		parsedBoard.explicitContent = true
	}

	if (board.icons) {
		parsedBoard.post.authorIcons = board.icons.map((icon) => ({
			id: icon.num,
			title: icon.name,
			// `url` property exists. It's not parsed because there seems to be no use for it
			// because "icon" URL template seems to be universal across the boards.
			// `url` property example: "/static/icons/gsg/[PDX] Paradox Interactive.png".
			// url: icon.url
		}))
	}

	if (board.threadTags) {
		parsedBoard.features.threadTags = board.tags
	}

	// parsedBoard.threadsPagesMaxCount = board.max_pages
	// parsedBoard.threadsPageSize = board.threads_per_page

	return parsedBoard
}

function getAttachmentFileTypes(makabaFileTypes) {
	// For some weird reason, `webp` is duplicated multiple times in `file_types`.
	return uniq(makabaFileTypes)
		.map(getAttachmentFileType)
		// Ignore unknown file types.
		.filter(_ => _)
}

function getAttachmentFileType(makabaFileType) {
	switch (makabaFileType) {
		case 'jpg':
			return 'image/jpg'
		case 'png':
			return 'image/png'
		case 'gif':
			return 'image/gif'
		case 'webm':
			return 'video/webm'
		case 'mp4':
			return 'video/mp4'
		case 'webp':
			return 'image/webp'
		case 'sticker':
		case 'youtube':
			// Skip
			return
		default:
			console.warn(`Unknown makaba file type: "${makabaFileType}"`)
			return
	}
}
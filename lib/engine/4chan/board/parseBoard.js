import unescapeText from '../../../utility/unescapeText.js'

/**
 * Parses response board JSON object.
 * @param  {object} board — Response board JSON object.
 * @return {object} See README.md for "Board" object description.
 */
export default function parseBoard(board, { boardCategories }) {
	// Returns board category by board ID.
	const getBoardCategory = (boardId) => {
		if (boardCategories) {
			for (const category of Object.keys(boardCategories)) {
				if (
					boardCategories[category].includes(boardId) ||
					boardCategories[category].includes('*')
				) {
					return category
				}
			}
		}
	}

	const parsedBoard = {
		id: board.board,
		title: board.title,
		description: unescapeText(board.meta_description),

		category: getBoardCategory(board.board),

		explicitContent: board.ws_board === 0,

		features: {
			bumpLimit: board.bump_limit
		},

		post: {
			threadTitleRequired: board.require_subject === 1,

			threadAttachmentsMaxCount: board.image_limit,
			contentMaxLength: board.max_comment_chars,

			attachments: !board.text_only,
			attachmentsMaxCount: board.text_only ? undefined : 1,

			attachmentSpoiler: board.spoilers === 1,

			// `4chan` only allows a single attachment in a comment.
			// Hence the single attachment max size is the total attachments max size.
			attachmentMaxSize: board.max_filesize, // in bytes
			videoAttachmentMaxSize: board.max_webm_filesize, // in bytes
			videoAttachmentMaxDuration: board.max_webm_duration, // in seconds

			threadMinInterval: board.cooldowns.threads,
			commentMinInterval: board.cooldowns.replies,
			commentWithAttachmentsMinInterval: board.cooldowns.images,

			authorIcons: board.board_flags && Object.keys(board.board_flags).map((id) => ({
				id,
				title: board.board_flags[id]
			})),

			authorName: !board.forced_anon,

			authorEmailSage: true,

			// Are flags showing the poster's country enabled on the board.
			authorCountry: board.country_flags === 1,

			// Are poster ID hashes enabled on the board.
			authorId: board.user_ids === 1,

			commentContent: {
				// `4chan.org` sometimes allows "TeX" (like "LaTeX") syntax for writing Math formulae.
				// https://b060e7a4-a-62cb3a1a-s-sites.googlegroups.com/site/scienceandmathguide/other/-sci-infographics/joseflatex.png?attachauth=ANoY7crDHFoNwHMiP0AS_eGBJo71fzfPs5KsVxxgPSfBrmswoaTPsnWHqwjKIzP4HDIrfv_-Io17zld0RAtcZOTIPTynm2om4nAd83WOpg6IT3WqCdrAEjqqrWwooCDgYrHWcTRxEM6myhEsGT46K30hInFQDZS17fz44X87VjfvKZQrwWLYIa7h1NU_7VZD3gBbuSZXLa8q4vMdBZfd_r2S1UlPwjVjpSoKRvV0PzuzHrshkjhVE9ko2Ap9T7rviyuSRJO3NGaQ&attredirects=0
				// Example: `/sci/` board.
				// The output on `4chan.org` is done using `jsMath` library which is deprecated since 2010.
				// The successor for `jsMath` is `MathJax`.
				// "TeX" formulae can be converted to "MathML" which is part of HTML5 standard:
				// https://en.wikipedia.org/wiki/MathML
				// That means that "MathML" formulae can be shown in web browsers without any third party libraries.
				tex: board.math_tags === 1,

				// `<pre/>` tags are used on `/g/` board to post code samples (or configs).
				code: board.code_tags === 1
			}
		}
	}

	// "is archived" flag means that 4chan archives threads on this board:
	// when threads on such board expire, they're saved in the "archive"
	// of this board and can still be accessed for some (usually short) time.
	if (board.is_archived) {
		parsedBoard.features.archive = {}
	}

	// // "SJIS" (aka "Shift_JIS") are ascii images created using Japanese fonts.
	// // Example: `/jp/` board.
	// if (board.sjis_tags) {
	// 	if (!parsedBoard.features.commentContent) {
	// 		parsedBoard.features.commentContent = {}
	// 	}
	// 	parsedBoard.features.commentContent.??? = true
	// }

	// // "oekaki" is a widget for drawing simple pictures for posting on an imageboard.
	// if (board.oekaki) {
	// 	parsedBoard.post.??? = true
	// }

	// if (board.custom_spoilers) {
	// 	// "How many custom spoilers does the board have":
	// 	// `custom_spoilers` — "Any positive integer"
	// 	parsedBoard.spoilersCount??? = board.custom_spoilers
	// }

	// if (board.webm_audio) {
	// 	parsedBoard.post.videoAttachmentAudio??? = true
	// }

	// if (board.min_image_width !== undefined) {
	// 	parsedBoard.post.minImageWidth??? = board.min_image_width
	// 	parsedBoard.post.minImageHeight??? = board.min_image_height
	// }

	return parsedBoard
}
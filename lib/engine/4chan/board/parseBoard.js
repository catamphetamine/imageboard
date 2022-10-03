import unescapeContent from '../../../utility/unescapeContent.js'

/**
 * Parses response board JSON object.
 * @param  {object} board — Response board JSON object.
 * @return {object} See README.md for "Board" object description.
 */
export default function parseBoard(board) {
	const parsedBoard = {
		id: board.board,
		title: board.title,
		description: unescapeContent(board.meta_description),
		category: getBoardCategory(board.board),
		bumpLimit: board.bump_limit,
		maxAttachmentsInThread: board.image_limit,
		features: {}
	}
	if (board.ws_board === 0) {
		parsedBoard.notSafeForWork = true
	}
	// "is archived" flag means that 4chan archives threads on this board:
	// when threads on such board expire, they're saved in the "archive"
	// of this board and can still be accessed for some (usually short) time.
	if (board.is_archived) {
		parsedBoard.features.archive = true
	}
	// `4chan.org` sometimes allows "TeX" (like "LaTeX") syntax for writing Math formulae.
	// https://b060e7a4-a-62cb3a1a-s-sites.googlegroups.com/site/scienceandmathguide/other/-sci-infographics/joseflatex.png?attachauth=ANoY7crDHFoNwHMiP0AS_eGBJo71fzfPs5KsVxxgPSfBrmswoaTPsnWHqwjKIzP4HDIrfv_-Io17zld0RAtcZOTIPTynm2om4nAd83WOpg6IT3WqCdrAEjqqrWwooCDgYrHWcTRxEM6myhEsGT46K30hInFQDZS17fz44X87VjfvKZQrwWLYIa7h1NU_7VZD3gBbuSZXLa8q4vMdBZfd_r2S1UlPwjVjpSoKRvV0PzuzHrshkjhVE9ko2Ap9T7rviyuSRJO3NGaQ&attredirects=0
	// Example: `/sci/` board.
	// The output on `4chan.org` is done using `jsMath` library which is deprecated since 2010.
	// The successor for `jsMath` is `MathJax`.
	// "TeX" formulae can be converted to "MathML" which is part of HTML5 standard:
	// https://en.wikipedia.org/wiki/MathML
	// That means that "MathML" formulae can be shown in web browsers without any third party libraries.
	if (board.math_tags) {
		parsedBoard.features.math = true
	}
	// "SJIS" (aka "Shift_JIS") are ascii images created using Japanese fonts.
	// Example: `/jp/` board.
	if (board.sjis_tags) {
		parsedBoard.features.shiftJISArt = true
	}
	// `<pre/>` tags are used on `/g/` board to post code samples (or configs).
	if (board.code_tags) {
		parsedBoard.features.codeTag = true
	}
	// "oekaki" is a widget for drawing simple pictures for posting on an imageboard.
	if (board.oekaki) {
		parsedBoard.features.oekaki = true
	}
	if (board.board_flags) {
		// `board_flags` — "Array of flag codes mapped to flag names".
		parsedBoard.badges = Object.keys(board.board_flags).map((id) => ({
			id,
			title: board.board_flags[id]
		}))
	}
	if (board.country_flags) {
		// "Are flags showing the poster's country enabled on the board".
		parsedBoard.features.flags = true
	}
	if (board.user_ids) {
		// "Are poster ID tags enabled on the board"
		parsedBoard.features.authorId = true
	}
	if (board.spoilers) {
		parsedBoard.features.spoilers = true
		// "How many custom spoilers does the board have":
		// `custom_spoilers` — "Any positive integer"
		parsedBoard.spoilersCount = board.custom_spoilers
	}
	if (board.text_only) {
		parsedBoard.features.attachments = false
	}
	if (board.forced_anon) {
		parsedBoard.features.authorName = false
	}
	if (board.webm_audio) {
		parsedBoard.features.videoAttachmentAudio = true
	}
	if (board.require_subject) {
		parsedBoard.threadSubjectRequired = true
	}
	if (board.min_image_width !== undefined) {
		parsedBoard.minImageWidth = board.min_image_width
		parsedBoard.minImageHeight = board.min_image_height
	}
	parsedBoard.maxCommentLength = board.max_comment_chars
	// `4chan` only allows a single attachment in a comment.
	// Hence the single attachment max size is the total attachments max size.
	parsedBoard.maxAttachmentSize = board.max_filesize // in bytes
	parsedBoard.maxVideoAttachmentSize = board.max_webm_filesize // in bytes
	parsedBoard.maxVideoAttachmentDuration = board.max_webm_duration // in seconds
	parsedBoard.createThreadCooldown = board.cooldowns.threads
	parsedBoard.createCommentCooldown = board.cooldowns.replies
	parsedBoard.createCommentWithAttachmentsCooldown = board.cooldowns.images
	return parsedBoard
}

function getBoardCategory(boardId) {
	for (const category of Object.keys(BOARD_CATEGORIES)) {
		if (BOARD_CATEGORIES[category].includes(boardId)) {
			return category
		}
	}
	return 'Other'
}

const BOARD_CATEGORIES = {
	'Japanese Culture': ['a', 'c', 'w', 'm', 'cgl', 'cm', 'f', 'n', 'jp'],
	'Video Games': ['v', 'vg', 'vp', 'vr'],
	'Interests': ['co', 'g', 'tv', 'k', 'o', 'an', 'tg', 'sp', 'asp', 'sci', 'his', 'int', 'out', 'toy'],
	'Creative': ['i', 'po', 'p', 'ck', 'ic', 'wg', 'lit', 'mu', 'fa', '3', 'gd', 'diy', 'wsg', 'qst'],
	'Miscellaneous': ['b', 'r9k', 'pol', 'bant', 'soc', 's4s'],
	'Adult': ['s', 'hc', 'hm', 'h', 'e', 'u', 'd', 'y', 't', 'hr', 'gif', 'aco', 'r']
}
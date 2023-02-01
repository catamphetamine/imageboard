import getBoardInfo from '../board/getBoardInfo.js'
import parseThread from './parseThread.js'

/**
 * Parses "get thread comments" API response.
 * @param  {object} response — "get thread comments" API response.
 * @return {object} `{ board, thread }`.
 */
export default function parseThreadResponse(response) {
	// Migrate old threads from archive to a new JSON format.
	response = migrateLegacyJsonResponse(response)

	const comments = response.threads[0].posts

	const thread = parseThread(comments[0], response)
	thread.comments = comments

	// `post.files` is gonna be `null` when there're no attachments.
	for (const comment of comments) {
		if (!comment.files) {
			comment.files = []
		}
	}

	return {
		board: getBoardInfo(response.board),
		thread
	}
}

// Migrates old threads from archive to a new JSON format.
function migrateLegacyJsonResponse(response) {
	// If it's not a legacy JSON format, return the response as is.
	if (!response.Board) {
		return response
	}

	// Move board info to a `.board` sub-object.
	const {
		Board,
		BoardInfo,
		BoardInfoOuter,
		BoardName,
		bump_limit,
		default_name,
		max_comment,
		max_files_size,
		max_pages,
		max_num,
		icons,
		...rest
	} = response

	response = rest

	response.board = {
		id: Board,
		name: BoardName,
		info: BoardInfo,
		info_outer: BoardInfoOuter,
		bump_limit,
		default_name,
		max_comment,
		max_files_size,
		max_pages,
		icons,
		file_types: [
			...(response.enable_images
				? [
					'jpg',
					'png',
					'gif',
					'sticker',
					'webp'
				]
				: []
			),
			...(response.enable_video
				? [
					'webm',
					'mp4',
					'youtube'
				]
				: []
			)
		]
	}

	// Transform `enable_...` flags from `1`/`0` to `true`/`false`.
	const flags = [
		'enable_dices',
		'enable_flags',
		'enable_icons',
		'enable_images',
		'enable_likes',
		'enable_names',
		'enable_oekaki',
		'enable_posting',
		'enable_sage',
		'enable_shield',
		'enable_subject',
		'enable_thread_tags',
		'enable_trips',
		'enable_video'
	]

	for (const flag of flags) {
		response.board[flag] = Boolean(response[flag])
		delete response[flag]
	}

	for (const post of response.threads[0].posts) {
		post.parent = Number(post.parent)
	}

	response.unique_posters = Number(response.unique_posters)

	return response
}
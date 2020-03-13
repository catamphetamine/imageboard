import getBoardInfo from '../board/getBoardInfo'

/**
 * Parses "get threads list" API response.
 * @param  {object} response — "get threads list" API response.
 * @return {object} `{ board, threads, comments }`.
 */
export default function parseThreadsResponse(response) {
	return {
		board: getBoardInfo(response),
		comments: response.threads,
		threads: response.threads.map(({
			num,
			posts_count,
			files_count,
			files,
			lasthit,
			closed,
			sticky,
			endless,
			tags
		}) => {
			const thread = {
				id: parseInt(num),
				commentsCount: posts_count,
				// `files_count` doesn't include the "opening comment"'s attachments in this case.
				// `files_count` is incorrect anyway:
				// https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/makaba-issues.md
				attachmentsCount: files_count + files.length,
				updatedAt: new Date(lasthit * 1000)
			}
			if (closed === 1) {
				thread.isLocked = true
			}
			// If the thread is pinned `sticky` will be a number greater than `0`.
			if (sticky > 0) {
				thread.isSticky = true
			}
			// "Rolling" threads never go into "bump limit":
			// instead messages are being shifted from the start of
			// such thread as new messages are posted to it.
			// The "opening post" is always preserved.
			if (endless === 1) {
				thread.isRolling = true
			}
			if (tags) {
				thread.tags = [tags]
			}
			return thread
		})
	}
}
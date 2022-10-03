import convertDateToUtc0 from '../utility/convertDateToUtc0.js'
import joinPath from '../utility/joinPath.js'

/**
 * Performs a "get thread comments" API query and parses the response.
 * @param  {object} engineTools — API URLs and configuration parameters, `request()` function, `parseThread()` function, etc.
 * @param  {object} parameters — `{ boardId, threadId }`.
 * @param  {object} [options] — See the README.
 * @return {Promise<object>} — A `Thread` object.
 */
export default function getThread({
	api,
	engine,
	incrementalThreadUpdateStartsAtCommentsCount,
	request,
	parseThread,
	parseIncrementalThreadResponse
}, parameters, {
	archived: isArchivedThread,
	afterCommentId,
	afterCommentsCount,
	...options
}) {
	// Returns a `Promise`.
	const getThread = () => {
		function getThread() {
			// If the tail isn't long enough, use the default "fetch thread" API.
			return request(api.getThread, {
				urlParameters: parameters
			}).then((response) => {
				return {
					response
				}
			})
		}

		// If the imageboard engine has a "-tail" fetch thread API (like `4chan` does),
		// then try using it first (if the method caller has explicitly opted in).
		if (isThreadEligibleForIncrementalUpdate({
			api,
			afterCommentId,
			afterCommentsCount,
			incrementalThreadUpdateStartsAtCommentsCount
		})) {
			return request(api.getThreadIncremental, {
				urlParameters: {
					...parameters,
					commentId: afterCommentId
				}
			}).then(
				(response) => {
					if (!parseIncrementalThreadResponse) {
						throw new Error(`Unsupported engine "${engine}" for "api.getThreadIncremental" feature`)
					}
					// If the incremental diff is sufficient in this case, use it.
					const _response = parseIncrementalThreadResponse(response, { afterCommentId })
					if (_response) {
						return {
							response: _response
						}
					}
					// Otherwise, use the default "fetch thread" API.
					return getThread()
				},
				// A `-tail` version doesn't always exist for a thread:
				// it's only created for a thread when it reaches a certain comments count threshold.
				// It's not clear what that threshold would be. I'd assume `50` at `4chan.org`.
				(error) => {
					console.error(error)
					// If the `-tail` version doesn't exist, use the default "fetch thread" API.
					return getThread()
				}
			)
		}

		// Use the default "fetch thread" API.
		return getThread()
	}

	// Returns a `Promise`.
	const getArchivedThread = () => {
		return request(api.getArchivedThread, {
			urlParameters: parameters
		}).then((response) => {
			return {
				archived: true,
				response
			}
		})
	}

	// `makaba` requires some hacky workarounds in order to determine
	// when a thread has been archived.
	// Returns a `Promise`.
	const getThreadFromArchiveMakaba = () => {
		return request(api.getArchivedThread, {
			urlParameters: parameters,
			returnResponseInfoObject: true
		}).then(
			({ response, url }) => {
				let archivedAt
				let archivedDateString
				// Extract `archivedAt` date from the "final" URL (after redirect).
				const archivedDateMatch = url.match(/\/arch\/(\d{4}-\d{2}-\d{2})\/res\//)
				if (archivedDateMatch) {
					archivedDateString = archivedDateMatch[1]
					const [year, month, day] = archivedDateString.split('-')
					archivedAt = convertDateToUtc0(new Date(year, month - 1, day))
				}
				return {
					response,
					archived: true,
					archivedAt,
					archivedDateString
				}
			}
		)
	}

	// Tries to load the thread from the archive.
	// Returns a `Promise`.
	const getThreadFromArchive = () => {
		if (engine === 'makaba') {
			return getThreadFromArchiveMakaba()
		}
		if (api.getArchivedThread) {
			return getArchivedThread()
		}
		return getThread()
	}

	// Returns a `Promise`.
	const fetchThread = () => {
		// If a thread is known to be archived then fetch it from the archive.
		if (isArchivedThread) {
			return getThreadFromArchive()
		}
		return getThread().catch((error) => {
			// `makaba` requires some hacky workarounds in order to
			// determine if a thread is archived.
			if (error.status === 404) {
				// Try to load the thread from the archive.
				return getThreadFromArchive()
			}
			throw error
		})
	}

	return fetchThread().then(
		({
			response,
			archived,
			archivedAt,
			archivedDateString
		}) => {
			const getMakabaOptions = () => {
				// For ancient `2ch.hk` (engine: "makaba") threads archived
				// between March 6th, 2016 and November 12th, 2016,
				// transform relative attachment URLs to absolute ones.
				// (`file_prefix` is "../" for those)
				if (archived && engine === 'makaba' && response.file_prefix) {
					return {
						transformAttachmentUrl(url) {
							return joinPath(`/${response.Board}/arch/${archivedDateString}/res`, response.file_prefix, url)
						}
					}
				}
			}

			// Parse the thread comments list.
			// `boardId` and `threadId` are still used there.
			const thread = parseThread(response, {
				...parameters,
				...options,
				...getMakabaOptions()
			})

			if (archived) {
				thread.locked = true
				thread.archived = true
				thread.archivedAt = archivedAt
			}

			return thread
		}
	)
}

function isThreadEligibleForIncrementalUpdate({
	api,
	afterCommentId,
	afterCommentsCount,
	incrementalThreadUpdateStartsAtCommentsCount
}) {
	if (afterCommentId) {
		if (api.getThreadIncremental) {
			if (incrementalThreadUpdateStartsAtCommentsCount === undefined) {
				return true
			}
			if (afterCommentsCount !== undefined) {
				if (afterCommentsCount >= incrementalThreadUpdateStartsAtCommentsCount) {
					return true
				}
			}
		}
	}
}
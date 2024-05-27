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
} = {}) {
	// Returns a `Promise`.
	const getThread = () => {
		function getThread() {
			// If the tail isn't long enough, use the default "fetch thread" API.
			return request(api.getThread, parameters).then(({ status, response }) => {
				return {
					status,
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
				...parameters,
				commentId: afterCommentId
			}).then(
				({ response, status }) => {
					if (!parseIncrementalThreadResponse) {
						throw new Error(`Engine "${engine}" doesn't support "api.getThreadIncremental" feature`)
					}
					// If the incremental diff is sufficient in this case, use it.
					const _response = parseIncrementalThreadResponse(response, { afterCommentId, status })
					if (_response) {
						return {
							status,
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
		return request(api.getArchivedThread, parameters).then(({ response, status }) => {
			return {
				archived: true,
				status,
				response
			}
		})
	}

	// `makaba` requires some hacky workarounds in order to determine
	// when a thread has been archived.
	// Returns a `Promise`.
	const getThreadFromArchiveMakaba = () => {
		return request(api.getArchivedThread, parameters).then(
			({ response, status, headers, url }) => {
				// The server is supposed to redirect to a more specific archived thread *.json URL
				// which contains the "archived on" date.
				let redirectToUrl

				// `status` will be `200` when `request()` function automatically follows redirects.
				// `status` will be `302` when `request()` function doesn't automatically follow redirects.
				if (status === 302) {
					// Example of `Location` HTTP response header value: /b/arch/2022-02-21/res/263550737.json
					redirectToUrl = headers.get('location')
				} else {
					redirectToUrl = url
				}

				// Get `archivedAt` and `archivedDateString` from "redirect-to" URL.
				let archivedAt
				let archivedDateString
				if (redirectToUrl) {
					// Extract `archivedAt` date from the "final" URL (after redirect).
					const archivedDateMatch = redirectToUrl.match(/\/arch\/(\d{4}-\d{2}-\d{2})\/res\//)
					if (archivedDateMatch) {
						archivedDateString = archivedDateMatch[1]
						const [year, month, day] = archivedDateString.split('-')
						archivedAt = convertDateToUtc0(new Date(year, month - 1, day))
					}
				}

				// If it didn't automatically follow the "redirect-to" URL,
				// the "redirect-to" URL has to be fetched manually.
				//
				// Returning status `302` wouldn't work with stupid `fetch()` in CORS mode
				// because when server returns a `302` response in CORS mode,
				// fetch doesn't allow to look into the response and instead sets
				// `response.status` to `0` and `response.headers` to empty headers.
				// https://github.com/denoland/deno/issues/4389
				// It could only potentially work when using `fetch()` in non-CORS mode.
				//
				const responsePromise = status === 302
					? request({
						method: 'GET',
						url: redirectToUrl
					})
					: Promise.resolve({ response, status })

				return responsePromise.then(({ response, status }) => {
					return {
						status,
						response,
						archived: true,
						archivedAt,
						archivedDateString
					}
				})

				// // Expected to have a "redirect-to" URL.
				// const error = new Error('INVALID_RESPONSE')
				// error.status = status
				// error.response = response
				// error.url = url
				// error.headers = headers
				// throw error
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
			status,
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
			const { thread, board } = parseThread(response, {
				...parameters,
				...options,
				...getMakabaOptions(),
				status
			})

			if (archived) {
				thread.locked = true
				thread.archived = true
				thread.archivedAt = archivedAt
			}

			return { thread, board }
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
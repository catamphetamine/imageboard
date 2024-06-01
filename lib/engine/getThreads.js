import sortThreadsByRating from './utility/sortThreadsByRating.js'
import sortThreadsByMostRecentComment from './utility/sortThreadsByMostRecentComment.js'
import sortThreadsByMostRecentlyCreated from './utility/sortThreadsByMostRecentlyCreated.js'

// import calculateThreadRating from './utility/calculateThreadRating.js'

const MAX_LATEST_COMMENTS_PAGES_TO_FETCH = 1

/**
 * Performs a "get threads list" API query and parses the response.
 * @param  {object} engineTools — API URLs and configuration parameters, `request()` function, `parseThreads()` function, etc.
 * @param  {object} parameters — `{ boardId }`.
 * @param  {object} [options] — See the README.
 * @return {Promise<object[]>} — A list of `Thread` objects.
 */
export default function getThreads({
	engine,
	api,
	request,
	parseThreads,
	parseThreadsPage,
	parseThreadsStats
}, parameters, {
	sortByRating,
	withLatestComments,
	maxLatestCommentsPages,
	...restOptions
} = {}) {
	// The API endpoint URL.
	let apiMethod = api.getThreads
	let fetchPagesWithLatestComments
	if (withLatestComments) {
		if (api.getThreadsWithLatestComments) {
			apiMethod = api.getThreadsWithLatestComments
		} else if (api.getThreadsWithLatestCommentsPage) {
			fetchPagesWithLatestComments = true
		}
	}

	// Fetch the data from the `/catalog.json` API endpoint.
	const requests = [{
		name: 'threads',
		request: () => request(apiMethod, parameters)
	}]

	// Fetch threads rating.
	if (sortByRating) {
		if (apiMethod.features && apiMethod.features.rating) {
			// Threads data already contains `rating`.
		} else if (api.getThreadsStats && api.getThreadsStats.features && api.getThreadsStats.features.rating) {
			// Fetch threads stats to get the `rating`s.
			requests.push({
				name: 'threadsStats',
				request: () => request(api.getThreadsStats, parameters)
			})
		}
	}

	// Optionally fetch threads list pages.
	if (fetchPagesWithLatestComments) {
		const maxPagesToFetch = maxLatestCommentsPages === undefined ? MAX_LATEST_COMMENTS_PAGES_TO_FETCH : maxLatestCommentsPages
		let i = 0
		while (i < maxPagesToFetch) {
			const apiMethod = i === 0
				? api.getThreadsWithLatestCommentsFirstPage || api.getThreadsWithLatestCommentsPage
				: api.getThreadsWithLatestCommentsPage

			// Create a new variable to prevent a "closure" bug of variable `i`.
			// Without this new variable, inside `requests` array, for any item of it,
			// `i` would always be the same last value.
			const index = i

			requests.push({
				name: 'threadsWithLatestCommentsPage',
				request: () => request(apiMethod, {
					...parameters,
					pageIndex: index,
					page: index + 1
				})
			})

			i++
		}
	}

	// Fetch the data from the `/catalog.json` API endpoint.
	// Wait until it fetches the data from `/catalog.json`,
	// along with the optional threads list pages.
	return makeHttpRequests(requests).then(
		(results) => {
			const threadsResult = results.find(_ => _.name === 'threads')
			const threadsStatsResult = results.find(_ => _.name === 'threadsStats')
			const threadsWithLatestCommentsPageResults = results.filter(_ => _.name === 'threadsWithLatestCommentsPage')

			// If even the `/catalog.json` request didn't succeed, then throw an error.
			if (threadsResult.error) {
				throw threadsResult.error
			}

			// Parse the threads list from `/catalog.json` response.
			let { board, threads: threadsList } = parseThreads(threadsResult.value.response, {
				...parameters,
				...restOptions,
				withLatestComments,
				status: threadsResult.value.status
			})

			// Parse the optional threads list pages.
			const threadsPages = []
			for (const threadsWithLatestCommentsPageResult of threadsWithLatestCommentsPageResults) {
				// As soon as any threads list page returns an error,
				// don't look for any further threads list pages.
				// This allows the application to iterate through all pages
				// without necessarily knowing the total count of the pages:
				// * Sometimes, it's present in the response.
				// * Sometimes, it's not present in the response at all.
				// * Sometimes, it could be known, but only via a separate HTTP query,
				//   which would result in additional latency, which is not the best UX.
				if (threadsWithLatestCommentsPageResult.error) {
					break
				}
				// Parse threads list page.
				const threadsPage = parseThreadsPage(threadsWithLatestCommentsPageResult.value.response, {
					...parameters,
					...restOptions,
					withLatestComments,
					status: threadsWithLatestCommentsPageResult.value.status
				})
				// Add threads list page.
				threadsPages.push(threadsPage)
			}

			threadsList = getFinalThreadsList(threadsList, { threadsPages, engine })

			// // Set `thread.rating` for each `thread`.
			// if (sortByRating) {
			// 	setThreadsRating(threadsList, { threadsStatsResult })
			// }

			const sortThreads = getThreadsSortingFunction({
				withLatestComments,
				sortByRating,
				threadsStats: threadsStatsResult && threadsStatsResult.value && parseThreadsStats(threadsStatsResult.value.response, { status: threadsStatsResult.value.status })
			})

			return {
				threads: sortThreads(threadsList),
				board
			}
		}
	)
}

function getThreadsListWithLatestCommentsFromThreadsListAndThreadPages(threadsList, threadsPages) {
	// First page will be treated in a special way
	// compared to the rest of the pages.
	const [firstPage, ...restPages] = threadsPages

	// // `firstPage` list will be used for lookup, so don't "mutate" it.
	// // The "full threads list" starts from the first threads page.
	// const threads = firstPage.slice()

	let threads = []

	// For all threads from `/catalog.json` response,
	// add them to the first page of the threads list
	// while skipping duplicates.
	// This way, it's gonna be the same complete list
	// as in case of a `/catalog.json` response, but
	// also with "latest comments" for the first page.
	for (const thread of threadsList) {
		if (!firstPage.threads.find(_ => _.id === thread.id)) {
			threads.push(thread)
		}
	}

	// For all the rest of the pages, for every thread on a page,
	// update its data in the full list of threads.
	// Such thread data has "latest comments", and if any threads
	// aren't present on those pages, they simply won't be updated
	// with their "latest comments" data, and they'll still be present
	// in the full list of threads.
	// The order of `threads` is preserved here.
	for (const threadsPage of restPages) {
		for (const thread of threadsPage.threads) {
			const existingThreadIndex = threads.findIndex(_ => _.id === thread.id)
			if (existingThreadIndex >= 0) {
				threads[existingThreadIndex] = thread
			}
		}
	}

	return firstPage.threads.concat(threads)
}

function getThreadsSortingFunction({
	withLatestComments,
	sortByRating,
	threadsStats
}) {
	if (sortByRating) {
		// Sort threads by rating.
		return (threads) => sortThreadsByRating(threads, { threadsStats })
	}

	if (withLatestComments) {
		// In `withLatestComments` scenario, it either uses the server's "native"
		// "get threads with latest comments" API, or it hacks around using "threads pages".
		// In any case, it manually re-sorts the list of threads at the end,
		// so the list of threads is already sorted at this point
		// and no additional re-sorting is required.
		return threads => threads
	}

	// Sort threads by most recently created.
	return sortThreadsByMostRecentlyCreated
}

function getFinalThreadsList(threadsList, { threadsPages, engine }) {
	// If no threads list pages have been loaded,
	// then simply return the result from `/catalog.json`.
	// For example, `4chan` already provides data for
	// `withLatestReplies` in `/catalog.json` response.
	// In other cases, when threads list pages have been loaded,
	// it means that the imageboard doesn't provide a "unified" way
	// of getting the list of all threads (with latest comments) at once,
	// so it'll have to combine the threads from different pages into a single list.
	if (threadsPages.length > 0) {
		threadsList = getThreadsListWithLatestCommentsFromThreadsListAndThreadPages(threadsList, threadsPages)
	}

	// Fix `lynxchan` bug when there's no `attachmentsCount` info
	// in threads list page data, so get it from the `/catalog.json` API response.
	if (engine === 'lynxchan') {
		for (const thread of threadsList) {
			const threadFromCatalog = threadsList.find(_ => _.id === thread.id)
			thread.attachmentsCount = threadFromCatalog.attachmentsCount
		}
	}

	// Sort threads by most recent replies.
	// It has to re-sort the whole list because it fetches different pages
	// at different time, so some threads from page N+1 fetched at time T+1
	// might have more recent replies than threads from page N fetched at time T.
	// Another reason is that even if all those pages were fetched at the same moment in time,
	// some imageboard engines like `makaba` still place "pinned" threads on top of all other ones.
	return sortThreadsByMostRecentComment(threadsList)
}

// function setThreadsRating(threadsList, { threadsStatsResult }) {
// 	for (const thread of threadsList) {
// 		let rating
// 		if (threadsStatsResult && !threadsStatsResult.error) {
// 			// `thread.id` might also not be present in the "stats" map
// 			// just because `threadsList` and `threadsStats` aren't necessarily in sync.
// 			//
// 			// In `makaba` engine, thread stats doesn't include "pinned" threads.
// 			// Also, "thread stats" response may be missing some of the threads
// 			// due to "race conditions" since getting the full threads list
// 			// and getting thread stats are two separate HTTP requests, not one.
// 			// So it also handles the case when a thread's rating is `undefined`.
// 			//
// 			// If a thread is missing from threads stats, then it means that
// 			// either the thread is "pinned" or the thread has just been created.
// 			// If a thread has just been created, then it's rating is `0`
// 			// because it doesn't have any comments or views yet.
// 			// If a thread is pinned then it will be shown at the top,
// 			// regardless of its rating.
// 			//
// 			const threadStats = threadsStatsResult.value[String(thread.id)]
// 			if (threadStats) {
// 				rating = threadStats.rating
// 			}
// 		}
// 		// if (rating === undefined) {
// 		// 	rating = calculateThreadRating(thread)
// 		// }
// 		thread.rating = rating
// 	}
// }

// Executes HTTP requests in parallel.
// Returns a `Promise`.
function makeHttpRequests(requests) {
	return Promise.allSettled(requests.map(_ => _.request())).then(
		(promiseResults) => {
			const results = []
			let i = 0
			while (i < promiseResults.length) {
				results.push({
					name: requests[i].name,
					error: promiseResults[i].status === 'rejected' ? promiseResults[i].reason : undefined,
					value: promiseResults[i].value
				})
				i++
			}
			return results
		}
	)
}
import {
	getSortThreadsByRating,
	sortThreadsByMostRecentReply,
	sortThreadsByMostRecentlyCreated
} from './sortThreads.js'

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
	const {
		getThreads: getThreadsUrl,
		getThreadsWithLatestComments: getThreadsWithLatestCommentsUrl,
		getThreadsWithLatestCommentsFirstPage: getThreadsWithLatestCommentsFirstPageUrl,
		getThreadsWithLatestCommentsPage: getThreadsWithLatestCommentsPageUrl,
		getThreadsStats: getThreadsStatsUrl
	} = api

	// The API endpoint URL.
	let url = getThreadsUrl
	let fetchPages
	if (withLatestComments) {
		if (getThreadsWithLatestCommentsUrl) {
			url = getThreadsWithLatestCommentsUrl
		} else if (getThreadsWithLatestCommentsPageUrl) {
			fetchPages = true
		}
	}

	// Fetch the data from the `/catalog.json` API endpoint.
	const promises = [
		request(url, { urlParameters: parameters })
	]

	// Fetch threads rating.
	if (sortByRating && getThreadsStatsUrl) {
		promises.push(request(getThreadsStatsUrl, { urlParameters: parameters }))
	}

	// Optionally fetch threads list pages.
	if (fetchPages) {
		const maxPagesToFetch = maxLatestCommentsPages === undefined ? MAX_LATEST_COMMENTS_PAGES_TO_FETCH : maxLatestCommentsPages
		let i = 0
		while (i < maxPagesToFetch) {
			const url = i === 0
				? getThreadsWithLatestCommentsFirstPageUrl || getThreadsWithLatestCommentsPageUrl
				: getThreadsWithLatestCommentsPageUrl
			promises.push(request(url, {
				urlParameters: {
					...parameters,
					pageIndex: i,
					page: i + 1
				}
			}))
			i++
		}
	}

	// Wait until it fetches the data from `/catalog.json`,
	// along with the optional threads list pages.
	return Promise.allSettled(promises).then(
		([response, ...pageResponses]) => {
			// If even the `/catalog.json` request didn't succeed, then throw an error.
			if (response.status === 'rejected') {
				throw response.reason
			}

			// Parse the threads list from `/catalog.json` response.
			const fullThreadsList = parseThreads(response.value, {
				...parameters,
				...restOptions,
				withLatestComments
			})

			// By default, `/catalog.json` sorts threads by most recent reply.
			let sortThreads
			if (withLatestComments) {
				// In `withLatestComments` threads can only be sorted by most recent reply.
				// By default, `/catalog.json` sorts threads by most recent reply.
				sortThreads = threads => threads
			}
			else if (sortByRating) {
				// Calculate threads rating, or parse threads rating response.
				let threadsStats
				if (getThreadsStatsUrl) {
					const { status, value } = pageResponses.shift()
					if (status !== 'rejected') {
						threadsStats = parseThreadsStats(value)
					}
				}
				// Sort threads by rating.
				sortThreads = getSortThreadsByRating(threadsStats)
			}
			else {
				// Sort threads by most recently created.
				sortThreads = sortThreadsByMostRecentlyCreated
			}

			// Parse the optional threads list pages.
			const threadsPages = []
			for (const pageResponse of pageResponses) {
				// As soon as any threads list page returns an error,
				// don't look at further threads list pages.
				// This makes it easy to "overestimate" the possible
				// threads list pages count because it's not known
				// beforehand. Sometimes, it could be known, but only
				// via a separate HTTP query, which would result in
				// additional latency, which is not the best UX.
				if (pageResponse.status === 'rejected') {
					break
				}
				// Parse threads list page.
				const threadsPage = parseThreadsPage(pageResponse.value, {
					...parameters,
					...restOptions,
					withLatestComments
				})
				// Add threads list page.
				threadsPages.push(threadsPage)
			}

			// If no threads list pages have been loaded,
			// then simply return the result from `/catalog.json`.
			// For example, `4chan` already provides data for
			// `withLatestReplies` in `/catalog.json` response.
			if (threadsPages.length === 0) {
				return sortThreads(fullThreadsList)
			}

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
			for (const thread of fullThreadsList) {
				if (!firstPage.find(_ => _.id === thread.id)) {
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
				for (const thread of threadsPage) {
					const existingThreadIndex = threads.findIndex(_ => _.id === thread.id)
					if (existingThreadIndex >= 0) {
						threads[existingThreadIndex] = thread
					}
				}
			}

			// Sort threads by most recent replies.
			threads = firstPage.concat(sortThreadsByMostRecentReply(threads))

			// Fix `lynxchan` bug when there's no `attachmentsCount` info
			// in threads list page data, so get it from the `/catalog.json` API response.
			if (engine === 'lynxchan') {
				for (const thread of threads) {
					const threadFromCatalog = fullThreadsList.find(_ => _.id === thread.id)
					thread.attachmentsCount = threadFromCatalog.attachmentsCount
				}
			}

			return threads
		}
	)
}

import getChanConfig from './chans/getConfig.js'
import getEngineConfig from './engine/getConfig.js'
import getImageboardConfig from './getImageboardConfig.js'

/**
 * Tells if an imageboard supports a certain feature.
 * @param  {(string|object)} imageboard ID or configuration object.
 * @param  {string} feature
 * @return {boolean}
 */
export default function supportsFeature(idOrConfig, feature) {
	let imageboardConfig
	if (typeof idOrConfig === 'string') {
		imageboardConfig = getChanConfig(idOrConfig)
	} else if (idOrConfig.engine) {
		imageboardConfig = getImageboardConfig(getEngineConfig(idOrConfig.engine), idOrConfig)
	} else {
		throw new Error('Couldn\'t get imageboard config')
	}

	switch (feature) {
		/*
		 * Returns `true` if the imageboard has a "get boards" API endpoint
		 * which returns a list of all available boards.
		 * The list of boards could be returned from a real API endpoint
		 * or it could be "hardcoded" for imageboards that don't provide such API.
		 */
		case 'getBoards':
			return Boolean(imageboardConfig.api && (
				imageboardConfig.api.getBoards
			)) || Boolean(imageboardConfig.boards)

		/*
		 * Returns `true` if the imageboard has a "get top boards" API endpoint
		 * that's different from the regular "get boards" API endpoint.
		 * In other words, returns `true` if an imageboard provides separate API
		 * endpoints for getting a list of "most popular boards" and a list of
		 * "all boards available".
		 */
		case 'getTopBoards':
			return Boolean(imageboardConfig.api && (
				imageboardConfig.api.getTopBoards
			))

		/*
		 * Returns `true` if the imageboard can search for boards by a search query.
		 */
		case 'findBoards':
			return Boolean(imageboardConfig.api && (
				imageboardConfig.api.findBoards
			))

		/*
		 * Returns `true` if the imageboard can sort threads by "rating".
		 */
		case 'getThreads.sortByRatingDesc':
			return Boolean(imageboardConfig.api && ((
				imageboardConfig.api.getThreads &&
				imageboardConfig.api.getThreads.features &&
				imageboardConfig.api.getThreads.features.rating
			) || (
				imageboardConfig.api.getThreadsStats &&
				imageboardConfig.api.getThreadsStats.features &&
				imageboardConfig.api.getThreadsStats.features.rating
			)))

		/*
		 * Returns `true` if the imageboard can search for threads on a board by a search query.
		 */
		case 'findThreads':
			return Boolean(imageboardConfig.api && (
				imageboardConfig.api.findThreads
			))

		/*
		 * Returns `true` if the imageboard can search for comments in a thread by a search query.
		 */
		case 'findComments':
			return Boolean(imageboardConfig.api && (
				imageboardConfig.api.findComments
			))

		/*
		 * Returns `true` if the imageboard can search for comments by a search query across the threads on a given board.
		 */
		case 'findComments.boardId':
			return Boolean(imageboardConfig.api && (
				// No engine currently supports "findComments" feature
				// so currently it just returns `false`.
				imageboardConfig.api.findThreads && false
			))

		/*
		 * Returns `true` if the imageboard can search for comments by a search query in a given thread on a given board.
		 */
		case 'findComments.threadId':
			return Boolean(imageboardConfig.api && (
				// No engine currently supports "findComments" feature
				// so currently it just returns `false`.
				imageboardConfig.api.findThreads && false
			))

		/*
		 * Returns `true` if the imageboard supports "vote for comment" API.
		 */
		case 'voteForComment':
			return Boolean(imageboardConfig.api && (
				imageboardConfig.api.vote
			))

		/*
		 * Returns `true` if the imageboard supports "vote for comment" API.
		 */
		case 'reportComment':
			return Boolean(imageboardConfig.api && (
				imageboardConfig.api.report
			))

		/*
		 * Returns `true` if the imageboard supports "create thread" API.
		 */
		case 'createThread':
			return Boolean(imageboardConfig.api && (
				imageboardConfig.api.post
			))

		/*
		 * Returns `true` if the imageboard supports "update thread" API.
		 */
		case 'updateThread':
			return false

		/*
		 * Returns `true` if the imageboard supports "create comment" API.
		 */
		case 'createComment':
			return Boolean(imageboardConfig.api && (
				imageboardConfig.api.post
			))

		/*
		 * Returns `true` if the imageboard supports "update comment" API.
		 */
		case 'updateComment':
			return false

		/*
		 * Returns `true` if the imageboard supports "create block bypass" API.
		 */
		case 'createBlockBypass':
			return Boolean(imageboardConfig.api && (
				imageboardConfig.api.createBlockBypass
			))

		/*
		 * Returns `true` if the imageboard supports "request CAPTCHA" API.
		 */
		case 'getCaptcha':
			return Boolean(imageboardConfig.api && (
				imageboardConfig.api.getCaptcha
			))

		/*
		 * Returns `true` if the imageboard supports "log in" API.
		 */
		case 'logIn':
			return Boolean(imageboardConfig.api && (
				imageboardConfig.api.logIn
			))

		/*
		 * Returns `true` if the imageboard supports "log in" API.
		 */
		case 'logIn.tokenPassword':
			return imageboardConfig.id === '4chan'

		/*
		 * Returns `true` if the imageboard supports "log out" API.
		 */
		case 'logOut':
			return Boolean(imageboardConfig.api && (
				imageboardConfig.api.logOut
			))

		default:
			throw new Error(`Unknown feature: ${feature}`)
	}

	return imageboardConfig.features.includes(feature)
}

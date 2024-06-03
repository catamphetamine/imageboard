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
		 * Returns `true` if the imageboard can search for boards by a search query.
		 */
		case 'findBoards':
			return Boolean(imageboardConfig.api && (
				imageboardConfig.api.findBoards
			))
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
		default:
			throw new Error(`Unknown feature: ${feature}`)
	}

	return imageboardConfig.features.includes(feature)
}

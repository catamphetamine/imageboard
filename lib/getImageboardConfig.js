import merge from 'lodash/merge.js'

import mergeConfigs from './utility/mergeConfigs.js'

export default function getImageboardConfig(engineSettings, chanSettings) {
	if (!engineSettings) {
		throw new Error('`engineSettings` are required')
	}

	// Merge imageboard custom settings with the engine's settings.
	const config = mergeConfigs(engineSettings, chanSettings)

	// Apply any `api` overrides.
	if (config.apiOverride) {
		config.api = merge({}, config.api, config.apiOverride)
		delete config.apiOverride
	}

	return config
}
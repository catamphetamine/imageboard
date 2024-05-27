import merge from 'lodash/merge.js'

export default function mergeConfigs(engineConfig, imageboardConfig) {
	const result = merge({}, engineConfig, imageboardConfig)

	// Merge `capcodes` and `customCapcodes`.
	if (result.capcodes && result.customCapcodes) {
		result.capcodes = {
			...result.capcodes,
			...result.customCapcodes
		}
	}

	return result
}
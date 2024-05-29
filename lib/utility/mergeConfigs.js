import merge from 'lodash/merge.js'

export default function mergeConfigs(engineConfig, imageboardConfig) {
	const result = merge({}, engineConfig, imageboardConfig)

	// Merge `capcodes` and `capcodesCustom`.
	if (result.capcodes && result.capcodesCustom) {
		result.capcodes = {
			...result.capcodes,
			...result.capcodesCustom
		}
	}

	return result
}
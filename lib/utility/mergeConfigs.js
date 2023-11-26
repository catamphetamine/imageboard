import merge from 'lodash/merge.js'

export default function mergeConfigs(engineConfig, imageboardConfig) {
	return merge({}, engineConfig, imageboardConfig)
}
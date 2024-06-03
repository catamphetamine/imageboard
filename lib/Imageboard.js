// This file only exists for multi-chan applications.

import getEngine from './engine/index.js'
import getImageboard from './chans/index.js'

export default function Imageboard(idOrConfig, options) {
	if (typeof idOrConfig === 'string') {
		const id = idOrConfig
		const Imageboard = getImageboard(id)
		if (Imageboard) {
			return Imageboard(options)
		}
		throw new RangeError(`Unknown imageboard: ${id}`)
	}
	const Engine = getEngine(idOrConfig.engine)
	return new Engine(idOrConfig, options)
}
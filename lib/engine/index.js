// This file only exists for multi-chan applications.

import Makaba from './makaba/index.js'
import FourChan from './4chan/index.js'
import LynxChan from './lynxchan/index.js'
import JsChan from './jschan/index.js'

export default function getEngine(engineId) {
	switch (engineId) {
		case 'makaba':
			return Makaba
		case '4chan':
		case 'vichan':
		case 'OpenIB':
			return FourChan
		case 'lynxchan':
			return LynxChan
		case 'jschan':
			return JsChan
		default:
			throw new RangeError(`Unknown imageboard engine: ${engineId}`)
	}
}
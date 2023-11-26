import MakabaConfig from '../engine/makaba/settings.json.js'
import FourChanConfig from '../engine/4chan/settings.json.js'
import LynxChanConfig from '../engine/lynxchan/settings.json.js'
import JsChanConfig from '../engine/jschan/settings.json.js'

export default function getEngineConfig(engineId) {
	switch (engineId) {
		case 'makaba':
			return MakabaConfig
		case '4chan':
		case 'vichan':
		case 'OpenIB':
			return FourChanConfig
		case 'lynxchan':
			return LynxChanConfig
		case 'jschan':
			return JsChanConfig
		default:
			throw new Error(`Unknown engine: ${engineId}`)
	}
}
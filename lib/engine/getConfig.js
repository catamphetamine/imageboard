import MakabaConfig from './makaba/settings.json.js'
import FourChanConfig from './4chan/settings.json.js'
import ViChanConfig from './vichan/settings.json.js'
import InfinityConfig_ from './infinity/settings.json.js'
import LynxChanConfig from './lynxchan/settings.json.js'
import JsChanConfig from './jschan/settings.json.js'

export default function getEngineConfig(engineId) {
	switch (engineId) {
		case 'makaba':
			return MakabaConfig
		case '4chan':
			return FourChanConfig
		case 'vichan':
			return ViChanConfig
		case 'infinity':
			return InfinityConfig
		case 'OpenIB':
			return OpenIBConfig
		case 'lynxchan':
			return LynxChanConfig
		case 'jschan':
			return JsChanConfig
		default:
			throw new Error(`Unknown engine: ${engineId}`)
	}
}

// `infinity` engine extends `vichan` engine.
const InfinityConfig = {
	...ViChanConfig,
	...InfinityConfig_
}

// `OpenIB` doesn't really add any features to the `infinity` engine.
// It just claims to be more "security-focused".
const OpenIBConfig = InfinityConfig
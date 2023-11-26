// This file only exists for multi-imageboard applications like `anychan`.
// Single-chan applications should import a specific imageboard directly
// from a corresponding sub-package.

import TwoChan from './2ch/index.js'
import FourChan from './4chan/index.js'
import EightChan from './8ch/index.js'
import KohlChan from './kohlchan/index.js'
import EndChan from './endchan/index.js'
import LainChan from './lainchan/index.js'
import ArisuChan from './arisuchan/index.js'
import NinetyFourChan from './94chan/index.js'
import PtChan from './ptchan/index.js'

import TwoChanConfig from '../../chans/2ch/index.json.js'
import FourChanConfig from '../../chans/4chan/index.json.js'
import EightChanConfig from '../../chans/8ch/index.json.js'
import KohlChanConfig from '../../chans/kohlchan/index.json.js'
import EndChanConfig from '../../chans/endchan/index.json.js'
import LainChanConfig from '../../chans/lainchan/index.json.js'
import ArisuChanConfig from '../../chans/arisuchan/index.json.js'
import NinetyFourChanConfig from '../../chans/94chan/index.json.js'
import PtChanConfig from '../../chans/ptchan/index.json.js'

const IMAGEBOARDS = [
	{ id: TwoChanConfig.id, imageboard: TwoChan },
	{ id: FourChanConfig.id, imageboard: FourChan },
	{ id: EightChanConfig.id, imageboard: EightChan },
	{ id: KohlChanConfig.id, imageboard: KohlChan },
	{ id: EndChanConfig.id, imageboard: EndChan },
	{ id: LainChanConfig.id, imageboard: LainChan },
	{ id: ArisuChanConfig.id, imageboard: ArisuChan },
	{ id: NinetyFourChanConfig.id, imageboard: NinetyFourChan },
	{ id: PtChanConfig.id, imageboard: PtChan }
]

export default function getImageboard(id) {
	for (const imageboard of IMAGEBOARDS) {
		if (imageboard.id === id) {
			return imageboard.imageboard
		}
	}
	// Doesn't throw an error if the imageboard is unknown.
	// Why? Perhaps to provide more flexibility to the app on how to handle such cases.
	// default:
	// 	throw new Error(`Unknown imageboard: ${chanId}`)
}
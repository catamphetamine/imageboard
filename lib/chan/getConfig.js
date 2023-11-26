// This file only exists for multi-chan applications
// that use `getConfig()` exported function.
//
// For example, `anychan` application imports `getConfig()`
// directly from "imageboard/commonjs/chan/getConfig".

import mergeConfigs from '../utility/mergeConfigs.js'
import getEngineConfig from './getEngineConfig.js'

import TwoChan from '../../chans/2ch/index.json.js'
import FourChan from '../../chans/4chan/index.json.js'
import EightChan from '../../chans/8ch/index.json.js'
import KohlChan from '../../chans/kohlchan/index.json.js'
import EndChan from '../../chans/endchan/index.json.js'
import LainChan from '../../chans/lainchan/index.json.js'
import ArisuChan from '../../chans/arisuchan/index.json.js'
import NinetyFourChan from '../../chans/94chan/index.json.js'
import PtChan from '../../chans/ptchan/index.json.js'

// A list of all supported chans.
const CHANS = [
	TwoChan,
	FourChan,
	EightChan,
	KohlChan,
	EndChan,
	LainChan,
	ArisuChan,
	NinetyFourChan,
	PtChan
]

// An index of all supported chans by their id (or alias).
const CHANS_INDEX = CHANS.reduce((index, chan) => {
	index[chan.id] = chan
	if (chan.aliases) {
		for (const alias of chan.aliases) {
			index[alias] = chan
		}
	}
	return index
}, {})

export default function getConfig(id) {
	if (!CHANS_INDEX[id]) {
		throw new Error(`Unknown imageboard: ${id}`)
	}
	const engineId = CHANS_INDEX[id].engine
	if (!engineId) {
		throw new Error('`engine` not specified for imageboard "' + id + '"')
	}
	return mergeConfigs(getEngineConfig(engineId), CHANS_INDEX[id])
}
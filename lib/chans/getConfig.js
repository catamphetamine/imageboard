// This file only exists for multi-chan applications
// that use `getConfig()` exported function.

import getImageboardConfig from '../getImageboardConfig.js'
import getEngineConfig from '../engine/getConfig.js'

import TwoChan from '../../chans/2ch/index.json.js'
import FourChan from '../../chans/4chan/index.json.js'
import EightChan from '../../chans/8ch/index.json.js'
import KohlChan from '../../chans/kohlchan/index.json.js'
import EndChan from '../../chans/endchan/index.json.js'
import LainChan from '../../chans/lainchan/index.json.js'
import ArisuChan from '../../chans/arisuchan/index.json.js'
import SmugLoli from '../../chans/smugloli/index.json.js'
import LeftyPol from '../../chans/leftypol/index.json.js'
import TvChan from '../../chans/tvchan/index.json.js'
import Bandada from '../../chans/bandada/index.json.js'
import WizardChan from '../../chans/wizardchan/index.json.js'
import JakpartySoy from '../../chans/jakparty.soy/index.json.js'
import JunkuChan from '../../chans/junkuchan/index.json.js'
import ZzzChan from '../../chans/zzzchan/index.json.js'
import AlogsSpace from '../../chans/alogs.space/index.json.js'
import NinetyFourChan from '../../chans/94chan/index.json.js'
import PtChan from '../../chans/ptchan/index.json.js'
import TahtaCh from '../../chans/tahtach/index.json.js'
import DioChan from '../../chans/diochan/index.json.js'
import VecchioChan from '../../chans/vecchiochan/index.json.js'
import NiuChan from '../../chans/niuchan/index.json.js'
import TwentySevenChan from '../../chans/27chan/index.json.js'
import HeolCafe from '../../chans/heolcafe/index.json.js'

// A list of all supported chans.
const CHANS = [
	TwoChan,
	FourChan,
	EightChan,
	KohlChan,
	EndChan,
	LainChan,
	ArisuChan,
	SmugLoli,
	LeftyPol,
	TvChan,
	Bandada,
	WizardChan,
	JakpartySoy,
	JunkuChan,
	ZzzChan,
	AlogsSpace,
	NinetyFourChan,
	PtChan,
	TahtaCh,
	DioChan,
	VecchioChan,
	NiuChan,
	TwentySevenChan,
	HeolCafe
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
	return getImageboardConfig(getEngineConfig(engineId), CHANS_INDEX[id])
}
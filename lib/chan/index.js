// This file only exists for multi-chan applications.

import TwoChan from './2ch/index.js'
import FourChan from './4chan/index.js'
import EightChan from './8ch/index.js'
import KohlChan from './kohlchan/index.js'
import EndChan from './endchan/index.js'
import LainChan from './lainchan/index.js'
import ArisuChan from './arisuchan/index.js'

export default function getChan(chanId) {
	switch (chanId) {
		case '2ch':
			return TwoChan
		case '4chan':
			return FourChan
		case '8ch':
			return EightChan
		case 'kohlchan':
			return KohlChan
		case 'endchan':
			return EndChan
		case 'lainchan':
			return LainChan
		case 'arisuchan':
			return ArisuChan
	}
}
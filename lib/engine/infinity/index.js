import Engine from '../../Engine.js'
import FourChanEngine from '../4chan/index.js'

import engineSettings from './settings.json.js'

import EIGHT_CHAN_PARSE_COMMENT_CONTENT_PLUGINS from './comment/parseCommentContentPlugins.js'

export default class InfinityEngine extends FourChanEngine {
	constructor(chanSettings, parameters) {
		super(chanSettings, {
			...parameters,
			engineSettings,
			parseCommentContentPlugins: EIGHT_CHAN_PARSE_COMMENT_CONTENT_PLUGINS
		})
	}
}
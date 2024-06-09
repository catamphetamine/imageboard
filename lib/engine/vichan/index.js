import Engine from '../../Engine.js'
import FourChanEngine from '../4chan/index.js'

import engineSettings from './settings.json.js'

import LAIN_CHAN_PARSE_COMMENT_CONTENT_PLUGINS from '../lainchan/comment/parseCommentContentPlugins.js'
import ARISU_CHAN_PARSE_COMMENT_CONTENT_PLUGINS from './comment/parseCommentContentPlugins.arisuchan.js'

export default class ViChanEngine extends FourChanEngine {
	constructor(chanSettings, parameters) {
		super(chanSettings, {
			...parameters,
			engineSettings,
			parseCommentContentPlugins: getParseCommentContentPlugins(chanSettings.id)
		})
	}
}

function getParseCommentContentPlugins(imageboardId) {
	switch (imageboardId) {
		case 'lainchan':
			return LAIN_CHAN_PARSE_COMMENT_CONTENT_PLUGINS
		case 'arisuchan':
			return ARISU_CHAN_PARSE_COMMENT_CONTENT_PLUGINS
		default:
			return LAIN_CHAN_PARSE_COMMENT_CONTENT_PLUGINS
	}
}
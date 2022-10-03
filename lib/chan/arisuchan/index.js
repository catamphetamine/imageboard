import Engine from '../../engine/4chan/index.js'
import config from '../../../chans/arisuchan/index.json.js'
export default (options) => new Engine(config, options)
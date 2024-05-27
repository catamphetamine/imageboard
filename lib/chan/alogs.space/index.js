import Engine from '../../engine/lynxchan/index.js'
import config from '../../../chans/alogs.space/index.json.js'
export default (options) => new Engine(config, options)
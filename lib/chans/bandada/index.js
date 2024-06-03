import Engine from '../../engine/lynxchan/index.js'
import config from '../../../chans/bandada/index.json.js'
export default (options) => new Engine(config, options)
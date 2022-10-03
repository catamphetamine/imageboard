import Engine from '../../engine/lynxchan/index.js'
import config from '../../../chans/endchan/index.json.js'
export default (options) => new Engine(config, options)
import Engine from '../../engine/jschan/index.js'
import config from '../../../chans/ptchan/index.json.js'
export default (options) => new Engine(config, options)
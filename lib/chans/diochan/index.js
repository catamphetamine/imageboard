import Engine from '../../engine/vichan/index.js'
import config from '../../../chans/diochan/index.json.js'
export default (options) => new Engine(config, options)
import Engine from '../../engine/vichan/index.js'
import config from '../../../chans/tvchan/index.json.js'
export default (options) => new Engine(config, options)